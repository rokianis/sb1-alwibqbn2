import React, { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { pingAddress } from '../../../services/api';

interface PingResult {
  isReachable: boolean;
  latency?: number;
  error?: string;
}

export function PingTester() {
  const [ip, setIp] = useState('');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<PingResult | null>(null);
  const [continuousPing, setContinuousPing] = useState(false);

  const handlePing = async () => {
    if (!ip || isPinging) return;
    
    setIsPinging(true);
    try {
      const result = await pingAddress(ip);
      setPingResult(result);
    } catch (error) {
      setPingResult({
        isReachable: false,
        error: 'Failed to ping host'
      });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (continuousPing && ip) {
      interval = setInterval(handlePing, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [continuousPing, ip]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address (e.g., 1.1.1.1)"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
        </div>
        <button
          onClick={handlePing}
          disabled={!ip || isPinging}
          className={`px-4 py-2 rounded-md flex items-center ${
            !ip || isPinging
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          <Activity className={`w-4 h-4 mr-2 ${isPinging ? 'animate-spin' : ''}`} />
          Ping
        </button>
        <button
          onClick={() => setContinuousPing(!continuousPing)}
          disabled={!ip}
          className={`px-4 py-2 rounded-md ${
            continuousPing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } text-white transition-colors`}
        >
          {continuousPing ? 'Stop' : 'Continuous Ping'}
        </button>
      </div>

      {pingResult && (
        <div className="mt-4 flex items-center space-x-2">
          {pingResult.isReachable ? (
            <>
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400">
                Response time: {pingResult.latency}ms
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-red-400">
                {pingResult.error || 'Host unreachable'}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}