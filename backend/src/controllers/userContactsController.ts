import { removeUserContactFromDatabase, retrieveUserContacts, saveUserContactToDatabase } from "../services/usercontacts_service";
import { Request, Response } from "express";

export const getUserContacts = async (req: Request, res: Response) => {
    const userId = req.params.userId?.toString();
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a string');
    }
    const userContacts = await retrieveUserContacts(userId);
    res.json({ userContacts });
}

export const saveUserContact = async (req: Request, res: Response) => {
  const userId = req.params.userId?.toString();
    const { contactName, phoneNumber, phoneNumberType } = req.body;
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }
    if (!phoneNumberType) {
      throw new Error('Phone number type is required');
    }
    const contactId = await saveUserContactToDatabase(userId, contactName, phoneNumber, phoneNumberType);
    res.json({ contactId });
}

export const deleteUserContact = async (req: Request, res: Response) => {
    const contactId = req.params.contactId?.toString();
    if (!contactId || typeof contactId !== 'string') {
      throw new Error('Contact ID must be a string');
    }
    await removeUserContactFromDatabase(contactId);
    res.json({ message: 'Contact deleted' });
}
