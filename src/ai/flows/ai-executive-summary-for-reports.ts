'use server';
/**
 * @fileOverview This file provides a Genkit flow for generating a concise executive summary for a vulnerability scan report.
 *
 * - aiExecutiveSummaryForReports - A function that generates an executive summary for a given report.
 * - ExecutiveSummaryInput - The input type for the aiExecutiveSummaryForReports function.
 * - ExecutiveSummaryOutput - The return type for the aiExecutiveSummaryForReports function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExecutiveSummaryVulnerabilitySchema = z.object({
  title: z.string().describe('The title or name of the vulnerability.'),
  severity: z
    .enum(['Critical', 'High', 'Medium', 'Low', 'Info'])
    .describe('The severity level of the vulnerability.'),
  description: z.string().describe('A detailed description of the vulnerability.'),
  impact: z.string().describe('The potential impact of the vulnerability if exploited.'),
});

const ExecutiveSummaryInputSchema = z.object({
  reportTitle: z.string().describe('The title of the vulnerability scan report.'),
  overallRiskScore: z.string().describe('The overall risk score assigned to the scanned asset.'),
  assetDescription:
    z.string().describe('A brief description of the asset that was scanned.'),
  vulnerabilities: z
    .array(ExecutiveSummaryVulnerabilitySchema)
    .describe('A list of detected vulnerabilities with their details.'),
});
export type ExecutiveSummaryInput = z.infer<typeof ExecutiveSummaryInputSchema>;

const ExecutiveSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated concise executive summary for the report.'),
});
export type ExecutiveSummaryOutput = z.infer<typeof ExecutiveSummaryOutputSchema>;

export async function aiExecutiveSummaryForReports(
  input: ExecutiveSummaryInput
): Promise<ExecutiveSummaryOutput> {
  return aiExecutiveSummaryForReportsFlow(input);
}

const executiveSummaryPrompt = ai.definePrompt({
  name: 'executiveSummaryPrompt',
  input: { schema: ExecutiveSummaryInputSchema },
  output: { schema: ExecutiveSummaryOutputSchema },
  prompt: `You are a highly experienced cybersecurity analyst tasked with preparing a concise executive summary for management based on a vulnerability scan report. Your summary must clearly articulate the key findings, with particular emphasis on Critical and High severity vulnerabilities, and provide an overview of the overall risk posture. The tone should be professional and easy to understand for non-technical stakeholders. Focus on actionable insights and the potential business impact.

---
**Report Title:** {{{reportTitle}}}
**Asset Description:** {{{assetDescription}}}
**Overall Risk Score:** {{{overallRiskScore}}}

**Vulnerabilities Detected:**
{{#each vulnerabilities}}
- **Severity:** {{{severity}}}
  **Title:** {{{title}}}
  **Description:** {{{description}}}
  **Impact:** {{{impact}}}
{{/each}}
---

Generate the executive summary based on the information above.`,
});

const aiExecutiveSummaryForReportsFlow = ai.defineFlow(
  {
    name: 'aiExecutiveSummaryForReportsFlow',
    inputSchema: ExecutiveSummaryInputSchema,
    outputSchema: ExecutiveSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await executiveSummaryPrompt(input);
    return output!;
  }
);
