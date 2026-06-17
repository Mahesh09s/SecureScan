/**
 * @fileOverview Environment variable validation for production readiness.
 */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'GEMINI_API_KEY'
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key] && !process.env[`NEXT_PUBLIC_${key}`]);
  
  if (missing.length > 0) {
    console.warn(`[Production Warning] Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
}
