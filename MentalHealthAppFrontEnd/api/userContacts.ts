const API_URL = process.env.EXPO_PUBLIC_API_URL;


export const getUserContacts = async (userId: string) => {
    const response = await fetch(`${API_URL}/contacts/getusercontacts/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user contacts');
    }
    const data = await response.json();
    return data.userContacts;
  };

export const saveUserContact = async (userId: string, contactName: string, phoneNumber: string, phoneNumberType: string) => {
    const response = await fetch(`${API_URL}/contacts/saveusercontact/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phoneNumber, phoneNumberType, contactName }),
    });
    if (!response.ok) {
      throw new Error('Failed to save user contact');
    }
    const data = await response.json();
    return data;
  };

  
export const deleteUserContact = async (userId: string, contactId: string) => {
    const response = await fetch(`${API_URL}/contacts/deleteusercontact/${userId}/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user contact');
    }
    return true;
  };
