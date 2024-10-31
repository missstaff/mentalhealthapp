const API_URL = process.env.EXPO_PUBLIC_API_URL;


export const getRecommendedResources = async () => {
    const response = await fetch(`${API_URL}/resources/recommendedresources`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to fetch recommended resources');
    }
    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 10));
    return data.resources;
  };