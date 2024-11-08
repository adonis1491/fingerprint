import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types/language';
import { useVisitorInfo } from '../hooks/useVisitorInfo';
import LanguageSwitcher from './LanguageSwitcher';
import GoogleMapComponent from './GoogleMapComponent';
import { Shield, Globe2, Monitor, Cpu, Smartphone, Wifi } from 'lucide-react';

export default function VisitorDashboard() {
  const { t, i18n } = useTranslation();
  const { visitorInfo, loading } = useVisitorInfo();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (visitorInfo?.geolocation) {
      setUserLocation({
        lat: visitorInfo.geolocation.latitude,
        lng: visitorInfo.geolocation.longitude
      });
    }
  }, [visitorInfo]);

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!visitorInfo) {
    return (
      <div className="p-4 bg-red-50 text-red-600">
        Error loading visitor information
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:flex justify-between items-center">
          <div className="flex items-center space-x-4 mb-3 sm:mb-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">WIICHAT</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('visitorId')}</p>
              <p className="font-mono text-sm text-gray-900">ALWcqbMbFgTh0dI5qB68</p>
            </div>
          </div>
          <LanguageSwitcher
            currentLanguage={i18n.language as Language}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase">{t('summary.visits')}</h3>
              <Globe2 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-lg font-semibold">{visitorInfo.visitCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase">{t('summary.privacyMode')}</h3>
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-lg font-semibold">
              {visitorInfo.isPrivateMode ? t('status.detected') : t('status.notDetected')}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase">{t('summary.ip')}</h3>
              <Monitor className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-lg font-mono">{visitorInfo.sourceIP}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase">{t('sections.networkStatus')}</h3>
              <Cpu className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-lg font-semibold">{visitorInfo.geolocation.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-4">{t('sections.networkStatus')}</h2>
              <div className="h-64">
                {userLocation && <GoogleMapComponent location={userLocation} />}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-4">{t('sections.networkStatus')}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('summary.ip')}</span>
                  <span className="font-mono">{visitorInfo.sourceIP}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">VPN</span>
                  <span className={visitorInfo.vpnDetected ? 'text-red-600' : 'text-green-600'}>
                    {visitorInfo.vpnDetected ? t('status.detected') : t('status.notDetected')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Proxy</span>
                  <span className={visitorInfo.proxyDetected ? 'text-red-600' : 'text-green-600'}>
                    {visitorInfo.proxyDetected ? t('status.detected') : t('status.notDetected')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('sections.anomalies')}</span>
                  <span className={visitorInfo.anomalies.length > 0 ? 'text-red-600' : 'text-green-600'}>
                    {visitorInfo.anomalies.length > 0 ? t('status.detected') : t('status.notDetected')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700">{t('sections.browserInfo')}</h2>
                <Monitor className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('sections.browserInfo')}</span>
                  <span>{visitorInfo.browserType} {visitorInfo.browserVersion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">OS</span>
                  <span>{visitorInfo.device.os.name} {visitorInfo.device.os.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('summary.privacyMode')}</span>
                  <span className={visitorInfo.isPrivateMode ? 'text-red-600' : 'text-green-600'}>
                    {visitorInfo.isPrivateMode ? t('status.detected') : t('status.notDetected')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700">{t('sections.deviceInfo')}</h2>
                <Smartphone className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-medium">{visitorInfo.device.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="font-medium">{visitorInfo.device.model}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('deviceInfo.screenResolution')}</p>
                    <p className="font-medium">{visitorInfo.screen.width}x{visitorInfo.screen.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('deviceInfo.colorDepth')}</p>
                    <p className="font-medium">{visitorInfo.screen.colorDepth} bits</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('deviceInfo.deviceMemory')}</p>
                    <p className="font-medium">{visitorInfo.deviceMemory || 'Unknown'} GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('deviceInfo.cpuCores')}</p>
                    <p className="font-medium">{visitorInfo.hardwareConcurrency}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-700">{t('sections.sessionInfo')}</h2>
                <Wifi className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('sessionInfo.lastVisit')}</span>
                  <span>{new Date(visitorInfo.lastVisit).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('sessionInfo.connectionType')}</span>
                  <span>{visitorInfo.connectionType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('sessionInfo.latency')}</span>
                  <span>{visitorInfo.latency.toFixed(0)}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}