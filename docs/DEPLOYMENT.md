# 🚀 SecureScan Enterprise Deployment Guide

This document provides the definitive roadmap for provisioning and deploying the SecureScan platform.

---

## 1. Environment Configuration
Create a `.env.local` file with the following verified credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Engine
GEMINI_API_KEY=your_google_ai_key
```

---

## 2. Local Initialization
```bash
# Install dependencies
npm install

# Initialize local development node
npm run dev
```

---

## 3. Firebase Provisioning

### Firestore (Database)
1. Navigate to the **Firebase Console** > **Firestore Database**.
2. Initialize in **Production Mode**.
3. Deploy Security Rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Authentication
1. Enable **Google** and **Email/Password** providers.
2. Configure **Authorized Domains** to include your production endpoint.

---

## 4. Production Deployment (App Hosting)
SecureScan is optimized for **Firebase App Hosting** for Next.js 15 SSR support.

1. Connect your GitHub repository to Firebase App Hosting.
2. Configure secrets in **Google Cloud Secret Manager**.
3. Trigger the build via `git push origin main`.

---

## 5. Containerized Deployment (Docker)
For self-hosted or cloud-native container platforms:

```bash
# Build Enterprise Image
docker build -t securescan-enterprise:latest .

# Run Node
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e GEMINI_API_KEY=your_key \
  securescan-enterprise:latest
```

---

## 🛡️ Production Security Checklist
- [ ] **MFA Enforcement**: Required for all Analyst clearant accounts.
- [ ] **Secret Management**: Keys must reside in Secret Manager, never in code.
- [ ] **CORS Restricted**: Lock authorized domains to production URL.
- [ ] **Audit Logs Verified**: Confirm `auditLogs` collection is active and receiving telemetry.

---

© 2024 SecureScan Technologies Corp. Confidential Deployment Documentation.
