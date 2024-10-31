import express, { Router } from 'express';
import { getRecommendedResources } from '../controllers/recommendedResourcesController';
const router = Router();

// Route to fetch the recommended resources
router.get('/recommendedresources', getRecommendedResources);

export default router;
