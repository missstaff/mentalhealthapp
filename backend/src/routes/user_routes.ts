import { updateDisplayName } from "../controllers/usersController";

const express = require('express');


const router = express.Router();

router.post('/updatedisplayname/:userId', updateDisplayName);

export default router;