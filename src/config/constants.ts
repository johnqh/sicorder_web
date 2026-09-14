export const CONSTANTS = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'sicorder',
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || 'sicorder.sudobility.com',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'Sudobility',
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'info@sudobility.com',
  CHROME_STORE_URL: import.meta.env.VITE_CHROME_STORE_URL || '',
} as const;
