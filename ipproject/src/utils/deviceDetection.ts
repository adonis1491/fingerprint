import UAParser from 'ua-parser-js';

const parser = new UAParser();

export const detectBrowser = () => {
  const result = parser.getResult();
  return {
    type: result.browser.name || 'Unknown',
    version: result.browser.version || 'Unknown',
    isSuspicious: isSuspiciousBrowser()
  };
};

export const detectDevice = () => {
  const result = parser.getResult();
  return {
    brand: result.device.vendor || 'Unknown',
    model: result.device.model || 'Unknown',
    type: result.device.type || 'desktop',
    os: {
      name: result.os.name || 'Unknown',
      version: result.os.version || 'Unknown'
    }
  };
};

const isSuspiciousBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('tor') || navigator.brave !== undefined;
};

export const detectDeviceAnomalies = (): string[] => {
  const anomalies: string[] = [];
  const device = detectDevice();
  
  if (window.screen.width > window.screen.height * 3) {
    anomalies.push('Unusual screen aspect ratio');
  }

  if (navigator.hardwareConcurrency === 1) {
    anomalies.push('Possible virtual environment');
  }

  if (device.type === 'mobile' && 'onmouseover' in window) {
    anomalies.push('Mobile device with mouse detection');
  }

  return anomalies;
};