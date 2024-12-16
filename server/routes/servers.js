import { Router } from 'express';
import { SSHManager } from '../utils/ssh.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/drives', async (req, res) => {
  const { ip, username, password } = req.body;
  const ssh = new SSHManager(ip, username, password);

  try {
    await ssh.connect();
    const drives = await ssh.getDriveInfo();
    res.json(drives);
  } catch (error) {
    logger.error('Error getting drive information:', error);
    res.status(500).json({ error: 'Failed to get drive information' });
  } finally {
    await ssh.disconnect();
  }
});

router.post('/packages/install', async (req, res) => {
  const { ip, username, password } = req.body;
  const ssh = new SSHManager(ip, username, password);

  const packages = [
    'erlang',
    'libssl-dev',
    'libgmp-dev',
    'libsqlite3-dev',
    'make',
    'cmake',
    'gcc',
    'g++',
    'cockpit',
    'nfs-common'
  ];

  try {
    await ssh.connect();
    const result = await ssh.installPackages(packages);
    res.json(result);
  } catch (error) {
    logger.error('Error installing packages:', error);
    res.status(500).json({ error: 'Failed to install packages' });
  } finally {
    await ssh.disconnect();
  }
});

export default router;