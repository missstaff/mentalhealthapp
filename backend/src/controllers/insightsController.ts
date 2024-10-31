import { Request, Response } from 'express';
import { getUserCheckinData, calculateAverages } from '../services/checkin_service';
import { getPersonalizedInsights, evaluateInsights } from '../services/insight_service';
import { logToFirestore } from '../services/logs_service';

export const getUserPersonalizedInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId?.toString();

    if (!userId) {
      await logToFirestore({
        eventType: 'ERROR',
        message: 'Invalid or missing User ID',
        data: { params: req.params },
        timestamp: new Date().toISOString(),
      });

      return res.status(400).json({ message: 'Invalid User ID' });
    }

    // Fetch user check-in data for the last week
    const checkinData = await getUserCheckinData(userId, 7);

    // Log if no check-in data found
    if (checkinData.length === 0) {
      await logToFirestore({
        eventType: 'INFO',
        message: 'No check-in data available for user',
        data: { userId },
        timestamp: new Date().toISOString(),
      });
    }

    const averages = calculateAverages(checkinData);
    const insights = await getPersonalizedInsights();
    const applicableInsights = evaluateInsights(averages, insights);

    res.json({ insights: applicableInsights });
  } catch (error: any) {
    console.error('Error fetching personalized insights:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to fetch personalized insights',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });

    res.status(500).json({ message: 'Error fetching personalized insights' });
  }
};
