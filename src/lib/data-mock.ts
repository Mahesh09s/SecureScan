export const DASHBOARD_STATS = [
  { label: 'Total Assets', value: '42', trend: '+12%', icon: 'ShieldCheck' },
  { label: 'Total Scans', value: '1,284', trend: '+8%', icon: 'Activity' },
  { label: 'Critical Issues', value: '7', trend: '-2', icon: 'AlertTriangle', color: 'text-destructive' },
  { label: 'High Risks', value: '24', trend: '+5', icon: 'Flame', color: 'text-orange-500' },
  { label: 'Risk Score', value: '72/100', trend: 'Improving', icon: 'BarChart' },
];

export const VULNERABILITIES = [
  {
    id: 'v1',
    title: 'Missing Security Headers',
    severity: 'Medium',
    asset: 'api.securescan.io',
    date: '2024-05-20',
    description: 'HSTS, X-Frame-Options, and Content-Security-Policy headers are missing or misconfigured.',
    impact: 'Increased risk of clickjacking and XSS attacks.',
    recommendation: 'Implement strict security headers in the web server configuration.',
  },
  {
    id: 'v2',
    title: 'Outdated OpenSSL Version',
    severity: 'Critical',
    asset: 'prod-server-01',
    date: '2024-05-18',
    description: 'The server is running a version of OpenSSL vulnerable to CVE-2023-0286.',
    impact: 'Possible denial of service or information disclosure.',
    recommendation: 'Upgrade OpenSSL to the latest stable version (3.0.8+).',
  },
  {
    id: 'v3',
    title: 'Weak SSH Cipher Suite',
    severity: 'High',
    asset: '192.168.1.50',
    date: '2024-05-19',
    description: 'The SSH server allows the use of legacy, insecure CBC ciphers.',
    impact: 'Man-in-the-middle attacks can potentially decrypt session data.',
    recommendation: 'Disable legacy ciphers and enable modern ones like ChaCha20-Poly1305.',
  },
  {
    id: 'v4',
    title: 'Unauthenticated Directory Listing',
    severity: 'Medium',
    asset: 'cdn.securescan.app',
    date: '2024-05-17',
    description: 'Web server configuration allows listing files in the /uploads directory.',
    impact: 'Information leakage of sensitive uploaded assets.',
    recommendation: 'Disable directory browsing in the web server settings.',
  },
];

export const ASSETS = [
  { id: '1', name: 'Main API', target: 'api.securescan.io', type: 'Website', status: 'Healthy', owner: 'DevOps Team' },
  { id: '2', name: 'Production Node', target: '10.0.0.15', type: 'Server', status: 'Scanning', owner: 'Infrastructure' },
  { id: '3', name: 'Customer Portal', target: 'portal.securescan.app', type: 'Website', status: 'Vulnerable', owner: 'Web Team' },
  { id: '4', name: 'Legacy DB', target: 'db.internal.local', type: 'IP Address', status: 'Healthy', owner: 'DBAs' },
];