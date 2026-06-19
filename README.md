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
*   **Live Telemetry**: Real-time terminal output during engine execution with automatic finding normalization.

### 🧠 Gemini AI Security Analyst
*   **Deep Vulnerability Analysis**: Technical deep-dives into CVEs and CVSS vectors.
*   **NIST-Aligned Remediation**: Step-by-step IR plans and secure coding recommendations tailored to specific telemetry.

### 📊 Strategic Dashboards & Reporting
*   **Security Health Index**: A-F grading based on real-time risk exposure using weighted CVSS scoring.
*   **GRC Alignment**: Automatic mapping of findings to OWASP Top 10 and MITRE ATT&CK® within executive-grade PDF reports.

---

## 🏗 Technology Stack

*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
*   **Backend**: Firebase (Firestore, Authentication).
*   **AI Engine**: Google Genkit + Gemini 2.5 Flash.
*   **Reporting**: jsPDF & jsPDF-AutoTable.
*   **Motion**: Framer Motion for tactical UI transitions.

---

## 📖 Documentation
- [**Technical Architecture**](./docs/ARCHITECTURE.md) - System design and data flow.
- [**Internal API Specs**](./docs/API.md) - REST endpoint documentation.
- [**Deployment Guide**](./docs/DEPLOYMENT.md) - Productionizing on Firebase & Docker.
- [**Testing & QA Strategy**](./docs/TESTING.md) - Multi-layered testing approach.
- [**Portfolio & Showcase**](./docs/PORTFOLIO.md) - Content for Resume, LinkedIn, and Portfolios.
- [**Software Requirements**](./docs/SRS.md) - Detailed functional specs.

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

## 📜 License & Ethical Use
SecureScan is intended exclusively for **educational purposes and authorized security assessments**. Users must obtain proper authorization before scanning any systems.

© 2024 SecureScan Technologies Corp. Built for Tactical Defense.
