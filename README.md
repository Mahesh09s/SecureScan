# 🛡️ SecureScan – Enterprise AI-Powered Vulnerability Command Center

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Provider-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Genkit](https://img.shields.io/badge/Genkit-AI_Orchestration-00A1E0?style=for-the-badge&logo=google)](https://firebase.google.com/docs/genkit)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

SecureScan is an elite, full-stack cybersecurity platform designed for high-compliance engineering teams. It provides a centralized command center for authorized asset discovery, multi-engine vulnerability auditing, and Gemini-powered remediation intelligence.

---

## 🚀 Key Features

### 📡 Tactical Asset Management
*   **Authorized Inventory**: Track Websites, Domains, IP Addresses, and Servers with explicit verification.
*   **Dynamic Categorization**: Tag and group assets by environment (Production, Staging, Dev).

### 🔍 Multi-Engine Auditing
*   **Orchestrated Scans**: Parallel execution of industry-standard tools including **Nuclei**, **OWASP ZAP**, and **Vuls**.
*   **Live Telemetry**: Real-time terminal output during engine execution.

### 🧠 Gemini AI Security Analyst
*   **Deep Vulnerability Analysis**: Technical deep-dives into CVEs and CVSS vectors.
*   **NIST-Aligned Remediation**: Step-by-step IR plans and secure coding recommendations.

### 📊 Strategic Dashboards & Reporting
*   **Security Health Index**: A-F grading based on real-time risk exposure.
*   **GRC Alignment**: Automatic mapping of findings to OWASP Top 10 and MITRE ATT&CK.

---

## 🏗 Technology Stack

*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
*   **Backend**: Firebase (Firestore, Authentication).
*   **AI Engine**: Google Genkit + Gemini 2.5 Flash.
*   **Reporting**: jsPDF & jsPDF-AutoTable.

---

## 🛠 Installation & Setup

### 1. Configure Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
GEMINI_API_KEY=your_google_ai_key
```

### 2. Initialize & Run
```bash
npm install
npm run dev
```

---

## 🚢 Deployment

SecureScan is optimized for **Firebase App Hosting**. 

For detailed production instructions, including Docker and SSL configuration, refer to the [**Deployment Guide**](./docs/DEPLOYMENT.md).

---

## 📖 Documentation
- [**Internal API Specs**](./docs/API.md)
- [**Deployment Roadmap**](./docs/DEPLOYMENT.md)
- [**Software Requirements**](./docs/SRS.md)

---

## 📜 License
© 2024 SecureScan Technologies Corp. Built for Defensive Security. Proprietary license for authorized organizational use.
