# SecureScan Enterprise REST API Documentation

This document specifies the internal and external API interfaces for the SecureScan cybersecurity platform. SecureScan utilizes a hybrid architecture of Next.js Server Actions, Genkit AI Flows, and Firebase SDKs. For integration purposes, the following endpoints represent the logical service layer.

- **API Version**: `v1.0.0`
- **Base URL**: `https://api.securescan.io/v1`
- **Auth Scheme**: `Bearer <Firebase_ID_Token>`
- **Content-Type**: `application/json`

---

## 1. Authentication & Session Management

### `POST /auth/session/sync`
Synchronizes the local Firebase session with the backend security layer and updates the analyst's heartbeat.

**Request Header**:
- `Authorization: Bearer <ID_TOKEN>`

**Response**: `200 OK`
```json
{
  "status": "active",
  "analystId": "auth_uid",
  "role": "analyst",
  "clearance": "L4",
  "mfaState": "verified"
}
```

---

## 2. Asset Perimeter Management

### `GET /assets`
Retrieve the inventory of authorized security targets.

**Query Parameters**:
- `type`: (Optional) `Website`, `Domain`, `Server`, `IP`
- `status`: (Optional) `Healthy`, `Vulnerable`, `Scanning`

**Response**: `200 OK`
```json
[
  {
    "id": "asset_99",
    "name": "Production API",
    "target": "api.company.com",
    "type": "Website",
    "environment": "Production",
    "status": "Healthy",
    "tags": ["critical", "pci-scope"]
  }
]
```

### `POST /assets`
Register a new authorized asset for auditing.

**Payload**:
```json
{
  "name": "Cloud Node Alpha",
  "target": "10.0.45.12",
  "type": "Server",
  "environment": "Staging",
  "consent": true
}
```

**Status Codes**:
- `201 Created`: Asset added successfully.
- `400 Bad Request`: Validation failure (Zod).
- `403 Forbidden`: Ethical consent not verified.

---

## 3. Scan Orchestration Engine

### `POST /scans/start`
Initiate an automated audit job using specialized engines (Nuclei, ZAP, etc.).

**Payload**:
```json
{
  "assetId": "asset_id",
  "engine": "nuclei",
  "intensity": "high",
  "ethicalConsent": true
}
```

**Response**: `202 Accepted`
```json
{
  "scanId": "job_123",
  "status": "In Progress",
  "estimatedCompletion": "120s",
  "telemetryUrl": "/v1/scans/job_123/telemetry"
}
```

### `GET /scans/{id}/telemetry`
Stream live execution logs from the audit node.

**Response Type**: `text/event-stream` (SSE)
```text
data: {"timestamp": "...", "level": "INFO", "message": "[Nuclei] Detecting CVE-2021-44228..."}
data: {"timestamp": "...", "level": "ALERT", "message": "Log4j RCE Detected."}
```

---

## 4. Vulnerability Intelligence

### `GET /vulnerabilities`
Query the centralized database of technical findings.

**Filters**:
- `severity`: `Critical`, `High`, `Medium`, `Low`, `Info`
- `assetId`: Filter by target.
- `cve`: Search for specific CVE ID.

**Response**: `200 OK`
```json
{
  "findings": [
    {
      "id": "vuln_01",
      "title": "SQL Injection in /login",
      "severity": "Critical",
      "cvss": 9.8,
      "cve": "N/A",
      "assetName": "Main Portal",
      "status": "Open"
    }
  ],
  "total": 14
}
```

### `POST /vulnerabilities/{id}/analyze`
Trigger the Gemini AI Analyst for a remediation deep-dive.

**Response**: `200 OK`
```json
{
  "explanation": "Markdown text...",
  "suggestedFixes": "Code blocks...",
  "remediationPlan": ["Step 1", "Step 2"],
  "nistMapping": "AC-2"
}
```

---

## 5. Enterprise Reporting

### `POST /reports/generate`
Synthesize technical findings into an executive-grade audit.

**Payload**:
```json
{
  "title": "Q1 Security Audit",
  "format": "pdf",
  "includeOwasp": true,
  "includeMitre": true,
  "aiSummary": true
}
```

**Response**: `201 Created`
```json
{
  "reportId": "rep_55",
  "downloadUrl": "https://storage.securescan.io/reports/rep_55.pdf",
  "riskScore": 88
}
```

---

## 6. Real-Time Notifications

### `GET /notifications`
Retrieve analyst alerts for the current session.

**Response**: `200 OK`
```json
[
  {
    "id": "notif_01",
    "title": "Scan Complete",
    "message": "Nuclei audit finished on Prod-API. 2 Critical findings.",
    "type": "success",
    "read": false
  }
]
```

---

## 7. Governance & Administrative APIs

### `GET /admin/audit-logs`
Retrieve the immutable record of system operations (Admins only).

**Response**: `200 OK`
```json
[
  {
    "timestamp": "2024-03-20T10:00:00Z",
    "analyst": "analyst@org.com",
    "action": "SCAN_START",
    "details": "Target: Production-DB",
    "ip": "192.168.1.1"
  }
]
```

### `PATCH /admin/roles/{userId}`
Update RBAC entitlements for a specific analyst.

**Payload**: `{ "role": "admin" | "analyst" | "viewer" }`

---

## Global Status Codes

| Code | Type | Description |
|---|---|---|
| `200` | OK | Request succeeded. |
| `201` | Created | Resource successfully initialized. |
| `202` | Accepted | Batch job (Scan/Report) queued. |
| `400` | Bad Request | Payload validation failed (Zod error). |
| `401` | Unauthorized | Bearer token missing or expired. |
| `403` | Forbidden | Insufficient RBAC or missing ethical consent. |
| `404` | Not Found | Resource ID does not exist. |
| `500` | Internal Error | Engine fault or AI timeout. |

© 2024 SecureScan Technologies Corp. Built for Tactical Defense.