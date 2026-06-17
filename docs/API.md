# SecureScan Internal API Documentation

SecureScan uses a combination of Next.js Server Actions and Genkit Flows for its backend operations.

## AI Flows (Genkit)

### `diagnoseVulnerability`
- **Purpose**: Explains a security finding and suggests fixes.
- **Input**: `VulnerabilityDetails`
- **Output**: `RemediationPlan` (Markdown)

### `generateExecutiveSummary`
- **Purpose**: Summarizes a full assessment for reports.
- **Input**: `ReportContext`
- **Output**: `ExecutiveSummary`

## Firestore Data Entities

### `assets`
| Field | Type | Description |
|---|---|---|
| `target` | string | URL, IP, or Domain |
| `status` | enum | Healthy, Vulnerable, Scanning |
| `type` | enum | Website, Server, IP |

### `scans`
| Field | Type | Description |
|---|---|---|
| `progress` | number | 0-100 |
| `status` | enum | In Progress, Completed, Failed |
| `logs` | array | Live technical output |

### `auditLogs`
| Field | Type | Description |
|---|---|---|
| `action` | string | Normalized action code (e.g., SCAN_START) |
| `userEmail` | string | Actor attribution |
| `timestamp` | Timestamp | Server-side time |
