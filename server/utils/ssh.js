import { NodeSSH } from 'node-ssh';
import { logger } from './logger.js';

export class SSHManager {
  constructor(host, username, password) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.ssh = new NodeSSH();
  }

  async connect() {
    try {
      await this.ssh.connect({
        host: this.host,
        username: this.username,
        password: this.password,
        tryKeyboard: true,
        onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
          if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
            finish([this.password]);
          }
        }
      });
      logger.info(`SSH connection established to ${this.host}`);
    } catch (error) {
      logger.error(`SSH connection failed to ${this.host}:`, error);
      throw error;
    }
  }

  async getDriveInfo() {
    try {
      const { stdout } = await this.ssh.execCommand('df -h');
      return this.parseDriveInfo(stdout);
    } catch (error) {
      logger.error('Error getting drive info:', error);
      throw error;
    }
  }

  async installPackages(packages) {
    try {
      const updateCmd = 'sudo DEBIAN_FRONTEND=noninteractive apt-get update';
      const installCmd = `sudo DEBIAN_FRONTEND=noninteractive apt-get install -y ${packages.join(' ')}`;
      
      await this.ssh.execCommand(updateCmd);
      const { stdout, stderr } = await this.ssh.execCommand(installCmd);
      
      logger.info('Package installation output:', stdout);
      if (stderr) logger.warn('Package installation warnings:', stderr);
      
      return { success: true, output: stdout };
    } catch (error) {
      logger.error('Package installation error:', error);
      throw error;
    }
  }

  parseDriveInfo(dfOutput) {
    const lines = dfOutput.split('\n').slice(1);
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [device, size, used, available, percentage, mountpoint] = line.split(/\s+/);
        return {
          device,
          size,
          used,
          available,
          mountPoint: mountpoint
        };
      });
  }

  async disconnect() {
    this.ssh.dispose();
    logger.info(`SSH connection closed for ${this.host}`);
  }
}