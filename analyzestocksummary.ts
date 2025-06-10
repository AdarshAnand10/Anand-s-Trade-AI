// src/ai/flows/analyze-stock-summary.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing the performance of a stock trading agent.
 *
 * - analyzeStockSummary - A function that takes performance metrics and returns a human-readable summary.
 * - AnalyzeStockSummaryInput - The input type for the analyzeStockSummary function.
 * - AnalyzeStockSummaryOutput - The return type for the analyzeStockSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStockSummaryInputSchema = z.object({
  initialBalance: z.number().describe('The initial balance of the trading account.'),
  finalBalance: z.number().describe('The final balance of the trading account after the backtest.'),
  totalProfit: z.number().describe('The total profit made during the backtest.'),
  episodes: z.number().describe('The number of episodes the agent trained on.'),
  symbol: z.string().describe('The stock ticker symbol used in the backtest, e.g. AAPL.'),
  startDate: z.string().describe('The start date for the backtest period.'),
  endDate: z.string().describe('The end date for the backtest period.'),
});
export type AnalyzeStockSummaryInput = z.infer<typeof AnalyzeStockSummaryInputSchema>;

const AnalyzeStockSummaryOutputSchema = z.object({
  summary: z.string().describe('A human-readable summary of the stock trading agent performance.'),
});
export type AnalyzeStockSummaryOutput = z.infer<typeof AnalyzeStockSummaryOutputSchema>;

export async function analyzeStockSummary(input: AnalyzeStockSummaryInput): Promise<AnalyzeStockSummaryOutput> {
  return analyzeStockSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStockSummaryPrompt',
  input: {schema: AnalyzeStockSummaryInputSchema},
  output: {schema: AnalyzeStockSummaryOutputSchema},
  prompt: `You are an expert financial analyst summarizing the performance of an AI stock trading agent.

  Given the following metrics from a backtest, provide a concise summary of the agent's performance in plain English.
  Be sure to mention the key metrics, such as initial balance, final balance and total profit.
  Also, include the episode count and the date range to provide context of the agent's trading period.
  Also, mention the stock ticker symbol that the agent traded.

  Initial Balance: {{{initialBalance}}}
  Final Balance: {{{finalBalance}}}
  Total Profit: {{{totalProfit}}}
  Number of Episodes: {{{episodes}}}
  Stock Ticker Symbol: {{{symbol}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Summary:`,
});

const analyzeStockSummaryFlow = ai.defineFlow(
  {
    name: 'analyzeStockSummaryFlow',
    inputSchema: AnalyzeStockSummaryInputSchema,
    outputSchema: AnalyzeStockSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
