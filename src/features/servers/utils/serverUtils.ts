import { Server } from '../../../types/server';
import { getDriveInfo } from '../../../services/api';

export async function createNewServer(
  newServer: Omit<Server, 'id' | 'isOnline' | 'drives'>
): Promise<Server> {
  const id = Date.now().toString();
  
  try {
    // Get real drive information from the server
    const drives = await getDriveInfo(
      newServer.ip,
      newServer.login,
      newServer.password
    );

    return {
      ...newServer,
      id,
      isOnline: true,
      drives
    };
  } catch (error) {
    console.error('Failed to get drive information:', error);
    return {
      ...newServer,
      id,
      isOnline: false,
      drives: []
    };
  }
}