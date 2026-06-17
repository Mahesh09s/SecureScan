# SecureScan Enterprise API Documentation

This document outlines the internal and external service interfaces for the SecureScan platform. SecureScan utilizes a hybrid architecture of Next.js Server Actions, Genkit Flows, and Firebase SDKs.

## Base Configuration

- **API Version**: `v1.0.0`
- **Environment**: Production
- **Authentication**: Firebase Identity Platform (JWT)
- **Base URL**: `https://api.securescan.io/v1`

---

## 1. Authentication & Identity
All requests (except login/register) require a valid Firebase ID Token in the `Authorization` header.

### `POST /auth/session`
Synchronizes the current client session with the backend security layer.
- **Header**: `Authorization: Bearer <ID_TOKEN>`
- **Response**: `200 OK`
```json
{
  "status": "active",
  "userId": "auth_uid",
  "role": "analyst",
  "permissions": ["scans:execute", "assets:write"]
}
```

---

## 2. Asset Management
Manage the authorized security perimeter.

### `GET /assets`
Retrieve all authorized assets for the authenticated organization.
- **Query Params**: `type`, `environment`, `status`
- **Response**: `200 OK`
```json
[
  {
    "id": "asset_01",
    "name": "Production API",
    "target": "api.company.com",
    "type": "Website",
    "status": "Healthy",
    "environment": "Production"
  }
]
```

### `POST /assets`
Register a new authorized asset. Requires ethical consent.
- **Payload**:
```json
{
  "name": "Cloud Node Alpha",
  "target": "10.0.45.12",
  "type": "Server",
  "environment": "Staging",
  "consent": true
}
```

---

## 3. Scan Orchestration
Control and monitor security auditing engines.

### `POST /scans/start`
Initiate an automated audit job.
- **Payload**:
```json
{
  "assetId": "asset_id",
  "type": "nuclei",
  "intensity": "high"
}
```
- **Status Codes**:
  - `201 Created`: Scan initialized successfully.
  - `403 Forbidden`: Ethical consent not verified.
  - `429 Too Many Requests`: Concurrent scan limit reached.

### `GET /scans/{scanId}/telemetry`
Stream live terminal logs from the execution node.
- **Response**: Server-Sent Events (SSE) or Poll
```json
{
  "timestamp": "2024-03-20T10:00:00Z",
  "level": "INFO",
  "message": "[Nuclei] Detecting CVE-2021-44228..."
}
```

---

## 4. Vulnerability Intelligence
Access and manage technical findings.

### `GET /vulnerabilities`
Query the vulnerability database.
- **Filters**: `severity`, `assetId`, `status`, `cve`
- **Response**:
```json
{
  "findings": [
    {
      "id": "vuln_01",
      "title": "SQL Injection in /login",
      "severity": "Critical",
      "cvss": 9.8,
      "cve": "N/A",
      "assetName": "Main Portal"
    }
  ],
  "total": 124
}
```

### `PATCH /vulnerabilities/{id}`
Update the remediation status of a finding.
- **Payload**: `{ "status": "Resolved", "notes": "Applied patch v2.1" }`

---

## 5. AI Security Agent (Genkit)
Interface with the specialized security LLM flows.

### `POST /ai/analyze`
Generate a step-by-step remediation plan for a finding.
- **Flow**: `aiVulnerabilityExplanationAndFix`
- **Input**: `vulnerabilityDetails`
- **Output**:
```json
{
  "explanation": "Markdown text...",
  "suggestedFixes": "Code blocks...",
  "remediationPlan": ["Step 1", "Step 2"]
}
```

---

## 6. Enterprise Reporting
Compile and export compliance documentation.

### `POST /reports/generate`
Synthesize scan data into an executive-grade audit.
- **Payload**:
```json
{
  "title": "Q1 Security Audit",
  "format": "pdf",
  "includeOwasp": true,
  "includeMitre": true
}
```
- **Response**: `202 Accepted` with `reportId`.

---

## 7. Governance & Audit
Administrative controls for organization-wide security.

### `GET /admin/audit-logs`
Retrieve the immutable record of platform actions.
- **Permissions**: `admin` role required.
```json
[
  {
    "timestamp": "...",
    "user": "analyst@org.com",
    "action": "SCAN_START",
    "details": "Target: Production-DB",
    "ip": "192.168.1.1"
  }
]
```

### `PUT /admin/roles/{userId}`
Update user entitlements.
- **Payload**: `{ "role": "admin" | "analyst" | "viewer" }`

---

## Error Handling

| Code | Type | Description |
|---|---|---|
| `400` | Invalid Request | Payload validation failed (Zod error). |
| `401` | Unauthorized | Bearer token missing or expired. |
| `403` | Forbidden | Insufficient RBAC privileges for the resource. |
| `404` | Not Found | Asset, Scan, or Finding ID does not exist. |
| `500` | Engine Fault | Internal server error or LLM timeout. |

---

## Rate Limits
- **Standard**: 1000 requests / hour / user.
- **Scans**: 5 concurrent jobs per organization node.
- **AI**: 50 analysis requests / hour (Tier 1).

© 2024 SecureScan Technologies Corp. All rights reserved.
