'use server';
/**
 * @fileOverview This file implements a Genkit flow for Security Operations tasks:
 * - Threat Hunting guidance with SIEM query generation.
 * - Incident Response suggestions following NIST/SANS frameworks.
 * - CVE/CVSS technical deep dives with exploitation mechanics.
 *
 * - aiSecurityOpsAssistant - A function that provides specialized security operations guidance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SecurityOpsInputSchema = z.object({
  query: z.string().describe('The user\'s security question or scenario.'),
  type: z.enum(['threat_hunt', 'incident_response', 'cve_analysis', 'general_security']).describe('The type of security assistance requested.'),
  context: z.string().optional().describe('Additional technical context (e.g., logs, environment details).'),
});
export type SecurityOpsInput = z.infer<typeof SecurityOpsInputSchema>;

const SecurityOpsOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the situation in markdown format.'),
  actionPlan: z.string().describe('Actionable steps or procedures in markdown format.'),
  technicalReferences: z.array(z.string()).describe('List of relevant CVEs, MITRE techniques, or documentation.'),
  suggestedQueries: z.array(z.string()).describe('Suggested follow-up questions or hunt queries.'),
});
export type SecurityOpsOutput = z.infer<typeof SecurityOpsOutputSchema>;

export async function aiSecurityOpsAssistant(input: SecurityOpsInput): Promise<SecurityOpsOutput> {
  return aiSecurityOpsAssistantFlow(input);
}

const securityOpsPrompt = ai.definePrompt({
  name: 'securityOpsPrompt',
  input: { schema: SecurityOpsInputSchema },
  output: { schema: SecurityOpsOutputSchema },
  prompt: `You are an elite Tier 3 SOC Analyst and Incident Responder. Your goal is to provide expert-level guidance on security operations.

Task Type: {{{type}}}
User Query: {{{query}}}
Technical Context: {{{context}}}

Guidelines:
1. If this is a **Threat Hunt**: Provide specific SIEM/KQL/Splunk queries and MITRE ATT&CK techniques. Explain why these queries are effective.
2. If this is **Incident Response**: Follow NIST SP 800-61 (Preparation, Detection/Analysis, Containment, Eradication, Recovery, Post-Incident). Use markdown tables to prioritize immediate containment actions.
3. If this is **CVE Analysis**: Explain the technical root cause (e.g., buffer overflow mechanics), breakdown the CVSS v3.1/v4.0 vector details, and describe specific exploitation mechanics.
4. Always use professional Markdown formatting. 
5. Provide code blocks for suggested commands (Shell, PowerShell), scripts (Python), or queries (KQL, SQL, YARA).
6. Use Markdown tables where appropriate to compare current vs. secure states or to detail CVSS vectors.

Ensure the output matches the specified JSON schema.`,
});

const aiSecurityOpsAssistantFlow = ai.defineFlow(
  {
    name: 'aiSecurityOpsAssistantFlow',
    inputSchema: SecurityOpsInputSchema,
    outputSchema: SecurityOpsOutputSchema,
  },
  async (input) => {
    const { output } = await securityOpsPrompt(input);
    if (!output) throw new Error('AI failed to generate security ops guidance.');
    return output;
  }
);
