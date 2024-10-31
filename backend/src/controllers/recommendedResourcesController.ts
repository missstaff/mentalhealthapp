import { Request, Response } from 'express';
import { logToFirestore } from '../services/logs_service';
import { fetchRecommendedResources } from '../services/recommendedresources_service';

export const getRecommendedResources = async (req: Request, res: Response) => {
  try {
    const resources = await fetchRecommendedResources();
    res.json({resources});
  } catch (error) {
    console.error('Error in recommended resources controller:', error);
    res.status(500).json({ error: 'Failed to fetch recommended resources.' });
  }
};

