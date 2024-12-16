import ping from 'ping';
import { logger } from './logger.js';

export async function pingServer(ip) {
  try {
    const result = await ping.promise.probe(ip, {
      timeout: 3,
      extra: ['-c', '3'],
    });

    logger.info(`Ping result for ${ip}:`, {
      alive: result.alive,
      time: result.time,
      packetLoss: result.packetLoss
    });

    return {
      isReachable: result.alive,
      latency: result.time,
      packetLoss: result.packetLoss,
    };
  } catch (error) {
    logger.error('Ping error:', error);
    throw error;
  }
}