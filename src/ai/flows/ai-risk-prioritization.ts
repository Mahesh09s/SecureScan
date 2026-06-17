
'use server';
/**
 * @fileOverview This file implements a Genkit flow for prioritizing security vulnerabilities based on severity and potential business impact.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VulnItemSchema = z.object({
  title: z.string(),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']),
  cvss: z.number().optional(),
  assetName: z.string().optional(),
});

const RiskPrioritizationInputSchema = z.object({
  vulnerabilities: z.array(VulnItemSchema),
  businessContext: z.string().optional().describe('Context about the business to help prioritize.'),
});
export type RiskPrioritizationInput = z.infer<typeof RiskPrioritizationInputSchema>;

const PrioritizedVulnSchema = z.object({
  title: z.string(),
  rank: z.number().describe('The priority rank (1 being highest).'),
  reasoning: z.string().describe('Why this vulnerability is prioritized at this rank.'),
});

const RiskPrioritizationOutputSchema = z.object({
  prioritizedList: z.array(PrioritizedVulnSchema),
  overallAssessment: z.string().describe('A high-level assessment of the risk posture.'),
});
export type RiskPrioritizationOutput = z.infer<typeof RiskPrioritizationOutputSchema>;

export async function prioritizeRisks(input: RiskPrioritizationInput): Promise<RiskPrioritizationOutput> {
  return riskPrioritizationFlow(input);
}

const riskPrioritizationPrompt = ai.definePrompt({
  name: 'riskPrioritizationPrompt',
  input: { schema: RiskPrioritizationInputSchema },
  output: { schema: RiskPrioritizationOutputSchema },
  prompt: `You are a Chief Information Security Officer (CISO). Given the following list of vulnerabilities, prioritize them for remediation. 
Consider the severity, CVSS scores, and the business context provided. 

Business Context: {{{businessContext}}}

Vulnerabilities:
{{#each vulnerabilities}}
- {{{title}}} (Severity: {{{severity}}}, CVSS: {{{cvss}}}, Asset: {{{assetName}}})
{{/each}}

Provide a ranked list with clear reasoning for each item, followed by an overall risk assessment.`,
});

const riskPrioritizationFlow = ai.defineFlow(
  {
    name: 'riskPrioritizationFlow',
    inputSchema: RiskPrioritizationInputSchema,
    outputSchema: RiskPrioritizationOutputSchema,
  },
  async (input) => {
    const { output } = await riskPrioritizationPrompt(input);
    return output!;
  }
);
