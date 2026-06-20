'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI-powered remediation plans for security vulnerabilities.
 *
 * - generateRemediationPlan - A function that initiates the AI remediation plan generation process.
 * - AiRemediationPlanGenerationInput - The input type for the generateRemediationPlan function.
 * - AiRemediationPlanGenerationOutput - The return type for the generateRemediationPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiRemediationPlanGenerationInputSchema = z.object({
  title: z.string().describe('The title of the vulnerability.'),
  description: z.string().describe('A detailed description of the vulnerability.'),
  impact: z.string().describe('The impact of the vulnerability.'),
  recommendation: z.string().describe('Any initial recommendations provided for the vulnerability.'),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']).describe('The severity level of the vulnerability.'),
  cve: z.string().optional().describe('The CVE ID of the vulnerability, if available.'),
  cvssScore: z.number().optional().describe('The CVSS score of the vulnerability, if available.'),
  evidence: z.string().optional().describe('Any relevant evidence or code snippets related to the vulnerability.'),
  references: z.array(z.string()).optional().describe('Relevant links or documentation for the vulnerability.'),
});
export type AiRemediationPlanGenerationInput = z.infer<typeof AiRemediationPlanGenerationInputSchema>;

const AiRemediationPlanGenerationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the remediation plan.'),
  remediationPlan: z.string().describe('A comprehensive, step-by-step remediation plan in markdown format, using numbered lists for steps.'),
  bestPractices: z.string().describe('Relevant security best practices related to the vulnerability and its remediation, in markdown format.'),
  codeExamples: z.string().optional().describe('Relevant code examples for fixing the vulnerability, in markdown format with code blocks.'),
});
export type AiRemediationPlanGenerationOutput = z.infer<typeof AiRemediationPlanGenerationOutputSchema>;

export async function generateRemediationPlan(
  input: AiRemediationPlanGenerationInput
): Promise<AiRemediationPlanGenerationOutput> {
  return aiRemediationPlanGenerationFlow(input);
}

const aiRemediationPlanGenerationPrompt = ai.definePrompt({
  name: 'aiRemediationPlanGenerationPrompt',
  input: { schema: AiRemediationPlanGenerationInputSchema },
  output: { schema: AiRemediationPlanGenerationOutputSchema },
  prompt: `You are a senior Cyber Security Engineer tasked with generating a comprehensive remediation plan for a detected vulnerability. Your goal is to provide a detailed, step-by-step guide including best practices and relevant code examples, suitable for a security analyst to implement.

Vulnerability Details:
Title: {{{title}}}
Severity: {{{severity}}}
Description: {{{description}}}
Impact: {{{impact}}}
Initial Recommendation: {{{recommendation}}}
{{#if cve}}CVE ID: {{{cve}}}
{{/if}}{{#if cvssScore}}CVSS Score: {{{cvssScore}}}
{{/if}}{{#if evidence}}Evidence:

\`\`\`
{{{evidence}}}
\`\`\`
{{/if}}{{#if references}}References:
{{#each references}}- {{{this}}}
{{/each}}
{{/if}}

Please generate the following:
1.  A concise summary of the remediation plan.
2.  A comprehensive, step-by-step remediation plan. Use a numbered list. Each step should be clear, actionable, and include specific instructions.
3.  Relevant security best practices that should be followed to prevent similar vulnerabilities in the future.
4.  Where applicable, provide code examples to illustrate the fix. Use markdown code blocks and specify the language.

Ensure the output is strictly in JSON format matching the following schema, including newlines and proper indentation for readability:

\`\`\`json
{
  "summary": "...",
  "remediationPlan": "...",
  "bestPractices": "...",
  "codeExamples": "..."
}
\`\`\`
`,
});

const aiRemediationPlanGenerationFlow = ai.defineFlow(
  {
    name: 'aiRemediationPlanGenerationFlow',
    inputSchema: AiRemediationPlanGenerationInputSchema,
    outputSchema: AiRemediationPlanGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await aiRemediationPlanGenerationPrompt(input);
    return output!;
  }
);
