'use client';

import { useEffect } from 'react';

/**
 * Hook to register service worker for PWA functionality
 */
export function usePWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((error) => {
            console.warn('⚠️ Service Worker registration failed:', error);
          });
      });

      // Listen for new service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 New service worker activated');
      });
    }
  }, []);
}

/**
 * Hook for requesting notification permission
 */
export function useNotificationPermission() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}

/**
 * Function to send notification
 */
export function sendNotification(title: string, options?: NotificationOptions) {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          ...options,
        });
      });
    }
  }
}
