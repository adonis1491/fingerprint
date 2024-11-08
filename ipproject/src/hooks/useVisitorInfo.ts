import { useState, useEffect } from 'react';
import type { VisitorInfo } from '../types/visitor';
import { detectNetwork } from '../utils/networkDetection';
import { detectBrowser, detectDevice, detectDeviceAnomalies } from '../utils/deviceDetection';
import { detectPrivacyMode } from '../utils/privacyDetection';
import { generateVisitorId } from '../utils/fingerprint';

export function useVisitorInfo() {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function collectVisitorInfo() {
      try {
        const [networkInfo, isPrivateMode, visitorId] = await Promise.all([
          detectNetwork(),
          detectPrivacyMode(),
          generateVisitorId()
        ]);

        const browserInfo = detectBrowser();
        const deviceInfo = detectDevice();
        const anomalies = detectDeviceAnomalies();

        const info: VisitorInfo = {
          id: visitorId,
          sourceIP: networkInfo.sourceIP,
          requestIP: networkInfo.sourceIP,
          connectionType: networkInfo.connectionType,
          latency: networkInfo.latency,
          geolocation: networkInfo.geolocation,
          isp: 'Local ISP',
          userAgent: navigator.userAgent,
          browserType: browserInfo.type,
          browserVersion: browserInfo.version,
          language: navigator.language,
          plugins: Array.from(navigator.plugins).map(p => p.name),
          isPrivateMode,
          isSuspiciousBrowser: browserInfo.isSuspicious,
          device: deviceInfo,
          screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            orientation: screen.orientation.type,
            scaling: window.devicePixelRatio
          },
          deviceMemory: (navigator as any).deviceMemory,
          hardwareConcurrency: navigator.hardwareConcurrency,
          visitCount: parseInt(localStorage.getItem('visitCount') || '1'),
          lastVisit: new Date().toISOString(),
          timeOnSite: 0,
          pagesViewed: [window.location.pathname],
          riskLevel: 'low',
          anomalies,
          vpnDetected: networkInfo.vpnDetected,
          proxyDetected: networkInfo.proxyDetected
        };

        localStorage.setItem('visitCount', (info.visitCount + 1).toString());
        setVisitorInfo(info);
      } catch (error) {
        console.error('Error collecting visitor info:', error);
      } finally {
        setLoading(false);
      }
    }

    collectVisitorInfo();
  }, []);

  return { visitorInfo, loading };
}