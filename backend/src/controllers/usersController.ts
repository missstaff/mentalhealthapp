import { updateUserDisplayNameService } from "../services/user_service";
import { Request, Response } from "express";

export const updateDisplayName = async (req: Request, res: Response) => {
  const { displayName } = req.body;
  const userId = req.params.userId?.toString();
  try {
    await updateUserDisplayNameService(userId, displayName);
    res.status(200).json({ message: 'Display Name updated successfully' });
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).json({ message: 'Failed to update display name' });
  }
};
