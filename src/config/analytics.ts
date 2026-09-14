import { getFirebaseService } from '@sudobility/di';

export type AnalyticsEventParams = Record<string, unknown>;

/** No-ops when Firebase isn't configured. */
export const analyticsService = {
  trackEvent(eventName: string, params?: AnalyticsEventParams): void {
    try {
      const service = getFirebaseService();
      if (service.analytics.isSupported()) {
        service.analytics.logEvent(eventName, { ...params, timestamp: Date.now() });
      }
    } catch {
      // Firebase service not initialized
    }
  },

  trackButtonClick(buttonName: string, params?: AnalyticsEventParams): void {
    this.trackEvent('button_click', { button_name: buttonName, ...params });
  },
};
