'use server';

/**
 * @fileOverview Explains the effect of hyperparameters on the AI trading agent.
 *
 * - explainHyperparameter - A function that explains the effect of a given hyperparameter.
 * - ExplainHyperparameterInput - The input type for the explainHyperparameter function.
 * - ExplainHyperparameterOutput - The return type for the explainHyperparameter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainHyperparameterInputSchema = z.object({
  hyperparameterName: z
    .string()
    .describe('The name of the hyperparameter to explain.'),
});
export type ExplainHyperparameterInput = z.infer<
  typeof ExplainHyperparameterInputSchema
>;

const ExplainHyperparameterOutputSchema = z.object({
  explanation: z
    .string()
    .describe('The explanation of the hyperparameter and its effects.'),
});
export type ExplainHyperparameterOutput = z.infer<
  typeof ExplainHyperparameterOutputSchema
>;

export async function explainHyperparameter(
  input: ExplainHyperparameterInput
): Promise<ExplainHyperparameterOutput> {
  return explainHyperparameterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainHyperparameterPrompt',
  input: {schema: ExplainHyperparameterInputSchema},
  output: {schema: ExplainHyperparameterOutputSchema},
  prompt: `You are an AI trading expert. Explain the following hyperparameter and its effects on the AI trading agent:

Hyperparameter Name: {{{hyperparameterName}}}
`,
});

const explainHyperparameterFlow = ai.defineFlow(
  {
    name: 'explainHyperparameterFlow',
    inputSchema: ExplainHyperparameterInputSchema,
    outputSchema: ExplainHyperparameterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
