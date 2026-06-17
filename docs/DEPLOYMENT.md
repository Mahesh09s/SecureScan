# 🚀 SecureScan Enterprise Deployment Guide

This document provides a comprehensive roadmap for deploying the SecureScan platform into a production environment. SecureScan is optimized for **Firebase App Hosting** but supports containerized deployment via **Docker**.

---

## 1. Prerequisites
- **Google Cloud Project**: Linked to a Firebase Project.
- **Firebase CLI**: Installed and authenticated (`firebase login`).
- **Domain Name**: Access to DNS settings for custom domain mapping.
- **Service Accounts**: Ensure the `App Hosting` service agent has `Firebase Admin` and `Secret Manager Secret Accessor` roles.

---

## 2. Firebase App Hosting (Recommended)

Firebase App Hosting is the preferred method for SecureScan as it natively supports Next.js 15 SSR, ISR, and localized edge deployment.

### Step 1: Initialize App Hosting
```bash
firebase apphosting:backends:create --project your-project-id
```
- Select your GitHub repository.
- Choose the branch (e.g., `main`).
- Select your preferred region (e.g., `us-central1`).

### Step 2: Configure Environment Secrets
Use **Google Cloud Secret Manager** for sensitive keys. App Hosting will automatically inject these into the environment.

| Secret Name | Mapping in `.env` |
|-------------|-------------------|
| `FIREBASE_API_KEY` | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `GEMINI_API_KEY` | `GEMINI_API_KEY` |

### Step 3: Trigger Deployment
Pushing to your tracked branch will trigger an automated build and rollout.

---

## 3. Docker Deployment (Alternative)

For self-hosted or cloud-native container platforms (AWS ECS, GKE, Azure Container Apps).

### Build the Image
```bash
docker build -t securescan-enterprise:latest .
```

### Run the Container
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e GEMINI_API_KEY=your_key \
  securescan-enterprise:latest
```

---

## 4. Database & Auth Provisioning

### Firestore (Database)
1.  Go to the **Firebase Console** > **Firestore Database**.
2.  Create database in **Production Mode**.
3.  Deploy Security Rules provided in the repository:
    ```bash
    firebase deploy --only firestore:rules
    ```

### Authentication
1.  Enable **Google** and **Email/Password** providers in the Firebase Auth tab.
2.  Configure **Authorized Domains** to include your production URL.

---

## 5. Custom Domain & SSL

### For Firebase App Hosting:
1.  Navigate to **App Hosting** > **Settings** > **Domains**.
2.  Click **Connect Domain**.
3.  Update your DNS with the provided **A Records** or **CNAME**.
4.  Firebase will automatically provision a **managed SSL certificate** via Let's Encrypt.

---

## 6. Production Security Checklist

- [ ] **MFA Enforcement**: Enable Multi-Factor Authentication for all Analyst accounts.
- [ ] **Secret Management**: Ensure `GEMINI_API_KEY` is NOT committed to git and is stored in Secret Manager.
- [ ] **CORS Policy**: Restrict authorized domains in the Firebase Console.
- [ ] **Audit Logging**: Verify that `auditLogs` are being populated for every administrative action.
- [ ] **Rate Limiting**: (Optional) Deploy a Cloud Armor policy if using Load Balancing.
- [ ] **Dependency Audit**: Run `npm audit` to ensure no critical vulnerabilities exist in the node modules.

---

## 7. Troubleshooting

| Issue | Resolution |
|-------|------------|
| `Hydration Mismatch` | Ensure all date transformations occur inside `useEffect` or use `suppressHydrationWarning`. |
| `Firestore 403` | Verify `firestore.rules` are deployed and the user has the correct RBAC role. |
| `AI Timeout` | Increase the Server Action timeout in `next.config.ts` to 60s for complex scans. |

---

© 2024 SecureScan Technologies Corp. Built for Defensive Excellence.
