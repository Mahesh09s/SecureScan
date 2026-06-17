# SecureScan – Enterprise Cyber Security Platform

SecureScan is a premium vulnerability management and security assessment dashboard built for modern engineering teams. It integrates automated asset discovery, real-time scanning, and AI-powered remediation.

## 🚀 Production Quick Start

### 1. Environment Configuration
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_google_ai_key
```

### 2. Deployment
This project is optimized for deployment on **Firebase App Hosting**.
- Connect your GitHub repository to the Firebase Console.
- Configure `apphosting.yaml` for SSR support.
- Set environment variables in the App Hosting dashboard.

## 🏗 Architecture
- **Framework**: Next.js 15 (App Router)
- **Database**: Cloud Firestore (Real-time synchronization)
- **Auth**: Firebase Authentication (MFA Ready)
- **AI**: Google Genkit (Gemini 2.5 Flash)
- **Styling**: Tailwind CSS + ShadCN UI (Glassmorphic Cyber Theme)

## 🛡 Security Posture
- **CSRF/XSS**: Handled natively by Next.js.
- **RBAC**: Enforced via Firestore Security Rules and Next.js middleware patterns.
- **Audit Logging**: Every sensitive action is logged to the `auditLogs` collection.
- **Contextual Errors**: Production builds surface technical security rule violations via the `FirebaseErrorListener`.

## 📈 Performance
- **Lighthouse**: Target score 95+ across all metrics.
- **Image Optimization**: Uses `next/image` with standardized placeholder seeds.
- **Code Splitting**: Native Next.js route-level splitting.

---
© 2024 SecureScan Technologies Inc.
