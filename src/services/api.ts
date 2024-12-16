import { API_BASE_URL } from '../config';

export async function pingAddress(ip: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip }),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ping error:', error);
    return {
      isReachable: false,
      error: 'Failed to reach server'
    };
  }
}

export async function getDriveInfo(ip: string, username: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/drives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip, username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get drive information');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting drive info:', error);
    throw error;
  }
}

export async function installPackages(ip: string, username: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/packages/install`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip, username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to install packages');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error installing packages:', error);
    throw error;
  }
}