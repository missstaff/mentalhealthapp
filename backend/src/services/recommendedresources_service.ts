import { app, db } from '../firebase_options';
import { firestore } from 'firebase-admin';
import { logToFirestore } from './logs_service';
import {createCache} from 'cache-manager';
import { recommendedResources } from '../interfaces/recommendedResources';

// Set up in-memory cache with a 24-hour expiration
const cache = createCache({ ttl: 86400000 });

const getRandomResource = (resources: recommendedResources[]) => {
  return resources[Math.floor(Math.random() * resources.length)];
};

export const fetchRecommendedResources = async (): Promise<recommendedResources[]> => {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const cacheKey = `dailyRecommendations-${today}`;

  try {
    // Check if resources are cached for today
    const cachedResources = await cache.get<recommendedResources[]>(cacheKey);
    if (cachedResources) {
      return cachedResources;
    }

    // Fetch all resources from Firestore if not cached
    const resourcesSnapshot = await firestore().collection('recommendedresources').get();

    const allResources: recommendedResources[] = resourcesSnapshot.docs.map((doc) => {
        const data = doc.data() as recommendedResources;
        return data;
      });

    // Group resources by category
    const resourcesByCategory = allResources.reduce<Record<string, recommendedResources[]>>((acc, resource) => {
        if (!acc[resource.category]) acc[resource.category] = [];
        acc[resource.category].push(resource);
        return acc;
      }, {});

    const categories = Object.keys(resourcesByCategory);
    if (categories.length < 2) {
      throw new Error('Not enough categories to select two different resources.');
    }

    // Shuffle categories and select two random ones
    const shuffledCategories = categories.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffledCategories.slice(0, 2);

    // Select one random resource from each category
    const selectedResources = selectedCategories.map(
      (category) => getRandomResource(resourcesByCategory[category])
    );

    // Cache today's recommendations
    await cache.set(cacheKey, selectedResources);

    return selectedResources;
  } catch (error: any) {
    console.error('Error fetching recommended resources:', error);
    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to fetch recommended resources',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });
    throw new Error('Failed to fetch recommended resources.');
  }
};
