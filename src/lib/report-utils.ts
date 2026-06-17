
/**
 * @fileOverview Utility functions for report data mapping and transformation.
 */

export const mapToOwasp = (title: string, description: string): string => {
  const content = (title + ' ' + description).toLowerCase();
  if (content.includes('injection') || content.includes('sql') || content.includes('xss') || content.includes('scripting')) return 'A03:2021-Injection';
  if (content.includes('broken access') || content.includes('permission') || content.includes('auth')) return 'A01:2021-Broken Access Control';
  if (content.includes('crypto') || content.includes('ssl') || content.includes('tls') || content.includes('certificate')) return 'A02:2021-Cryptographic Failures';
  if (content.includes('design') || content.includes('architecture')) return 'A04:2021-Insecure Design';
  if (content.includes('misconfiguration') || content.includes('header')) return 'A05:2021-Security Misconfiguration';
  if (content.includes('vulnerable') || content.includes('outdated')) return 'A06:2021-Vulnerable and Outdated Components';
  if (content.includes('identification') || content.includes('authentication')) return 'A07:2021-Identification and Authentication Failures';
  if (content.includes('integrity') || content.includes('software') || content.includes('update')) return 'A08:2021-Software and Data Integrity Failures';
  if (content.includes('logging') || content.includes('monitoring')) return 'A09:2021-Security Logging and Monitoring Failures';
  if (content.includes('ssrf') || content.includes('server side request')) return 'A10:2021-Server-Side Request Forgery';
  return 'N/A';
};

export const mapToMitre = (title: string, description: string): string => {
  const content = (title + ' ' + description).toLowerCase();
  if (content.includes('exploit') || content.includes('vulnerability')) return 'T1190 - Exploit Public-Facing Application';
  if (content.includes('scan') || content.includes('nmap')) return 'T1595 - Active Scanning';
  if (content.includes('brute') || content.includes('password')) return 'T1110 - Brute Force';
  if (content.includes('phish')) return 'T1566 - Phishing';
  if (content.includes('script') || content.includes('python')) return 'T1059 - Command and Scripting Interpreter';
  if (content.includes('cloud')) return 'T1535 - Unused/Unsupported Cloud Resource';
  return 'T1203 - Exploitation for Client Execution';
};

export const calculateRiskScore = (vulnerabilities: any[]): number => {
  if (vulnerabilities.length === 0) return 100;
  const weights = { Critical: 10, High: 5, Medium: 2, Low: 1, Info: 0 };
  const penalty = vulnerabilities.reduce((acc, v) => acc + (weights[v.severity as keyof typeof weights] || 0), 0);
  return Math.max(0, 100 - penalty);
};
