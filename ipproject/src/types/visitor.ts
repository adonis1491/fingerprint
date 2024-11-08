export interface VisitorInfo {
  id: string;
  sourceIP: string;
  requestIP: string;
  connectionType: string;
  latency: number;
  geolocation: {
    country: string;
    city: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
  isp: string;

  userAgent: string;
  browserType: string;
  browserVersion: string;
  language: string;
  plugins: string[];
  isPrivateMode: boolean;
  isSuspiciousBrowser: boolean;

  device: {
    brand: string;
    model: string;
    type: string;
    os: {
      name: string;
      version: string;
    };
  };

  screen: {
    width: number;
    height: number;
    colorDepth: number;
    orientation: string;
    scaling: number;
  };
  deviceMemory?: number;
  hardwareConcurrency?: number;
  
  visitCount: number;
  lastVisit: string;
  timeOnSite: number;
  pagesViewed: string[];
  
  riskLevel: 'low' | 'medium' | 'high';
  anomalies: string[];
  vpnDetected: boolean;
  proxyDetected: boolean;
}