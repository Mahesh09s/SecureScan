# 🏗️ SecureScan Technical Architecture

This document outlines the system architecture of the SecureScan platform. SecureScan is built using a modern, serverless, event-driven architecture designed for high availability, real-time telemetry, and AI-driven intelligence.

---

## 1. High-Level System Overview

SecureScan utilizes a hybrid cloud architecture leveraging **Next.js 15** for the core application logic and **Firebase** for persistence and identity.

```mermaid
graph TD
    User((Security Analyst)) --> Web[Next.js 15 App Router]
    
    subgraph "Application Layer (SSR & Client)"
        Web --> Auth[Firebase Auth]
        Web --> UI[ShadCN / Tailwind UI]
        Web --> Hooks[Custom Firebase Hooks]
    end

    subgraph "Intelligence & Backend"
        Web --> Genkit[Genkit AI Flows]
        Genkit --> Gemini[Gemini 2.5 Flash]
        Web --> ScanEngine[Scan Orchestration Engine]
    end

    subgraph "Persistence Layer"
        Hooks --> Firestore[(Cloud Firestore)]
        ScanEngine --> Firestore
        Auth --> Firestore
    end
```

---

## 2. Core Modules

### 2.1 Authentication & RBAC
- **Identity Provider**: Firebase Authentication (Google & Email/Password).
- **Entitlements**: Role-Based Access Control (RBAC) enforced via Firestore Security Rules.
- **Roles**: `Admin`, `Analyst`, `Viewer`.

### 2.2 Scan Orchestration Engine
The Scanning Engine is an asynchronous, state-managed pipeline that simulates industry-standard tool behavior while maintaining ethical consent boundaries.

```mermaid
sequenceDiagram
    participant Analyst
    participant Dashboard
    participant Firestore
    participant Engine
    
    Analyst->>Dashboard: Select Asset & Tool
    Analyst->>Dashboard: Verify Ethical Consent
    Dashboard->>Firestore: Create Scan Document (Status: In Progress)
    Dashboard->>Engine: Initiate Simulation Workflow
    
    loop Real-Time Telemetry
        Engine->>Firestore: Update logs & progress (%)
        Firestore-->>Dashboard: Real-time Listener Update
    end
    
    Engine->>Firestore: Generate Vulnerability Findings
    Engine->>Firestore: Finalize Scan (Status: Completed)
    Engine->>Firestore: Push Notification
```

### 2.3 AI Intelligence Module
Powered by **Google Genkit**, the AI module handles complex technical tasks:
- **Vulnerability Explanation**: Deep dive into technical mechanics.
- **Remediation Planning**: Generating NIST-aligned IR plans.
- **Threat Hunting**: Synthesizing SIEM queries (KQL/Splunk).
- **Executive Summarization**: Tailoring technical data for C-suite stakeholders.

### 2.4 Persistence (Firestore)
The database is structured for real-time reactivity:
- `/users/{uid}`: Profile and settings.
- `/assets/{id}`: Scoped security targets.
- `/scans/{id}`: Job execution and logs.
- `/vulnerabilities/{id}`: Normalized findings.
- `/auditLogs/{id}`: Immutable platform operations history.

---

## 3. Data Flow: Reporting Hub

```mermaid
graph LR
    V[(Vulnerabilities)] --> Reporter[Report Generator]
    Reporter --> Mapper[GRC Framework Mapper]
    Mapper --> AI[Genkit Executive Summary]
    AI --> PDF[jsPDF Compilation]
    PDF --> Cloud[(Firestore Storage)]
```

---

## 4. Deployment Architecture

SecureScan is optimized for **Firebase App Hosting**, providing native support for Next.js SSR and localized edge deployment.

- **Frontend**: Next.js 15 (Turbopack optimized).
- **Edge Runtime**: SSR components executed on Google Cloud Run.
- **Secrets Management**: Google Cloud Secret Manager integration for `FIREBASE_API_KEY` and `GEMINI_API_KEY`.
- **CI/CD**: Automatic rollouts via GitHub integration.

---

© 2024 SecureScan Technologies Corp. Built for Defensive Excellence.
