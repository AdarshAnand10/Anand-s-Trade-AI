
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, BarChart, CalendarDays, Sparkles } from 'lucide-react'; 
import type { PerformanceMetrics } from '@/types';
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceSummaryProps {
  metrics: PerformanceMetrics | null;
  aiSummary: string | null;
  isLoading: boolean;
  isAiSummaryLoading: boolean;
}

const MetricItem: React.FC<{ icon: React.ElementType, label: string, value: string | number | undefined, isLoading: boolean, unit?: string }> = ({ icon: Icon, label, value, isLoading, unit }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center text-sm text-muted-foreground">
      <Icon size={16} className="mr-2" />
      {label}
    </div>
    {isLoading ? <Skeleton className="h-6 w-24" /> : <p className="text-2xl font-semibold">{unit}{value !== undefined ? (typeof value === 'number' ? value.toLocaleString() : value) : 'N/A'}</p>}
  </div>
);


export function PerformanceSummary({ metrics, aiSummary, isLoading, isAiSummaryLoading }: PerformanceSummaryProps) {
  const { initialBalance, finalBalance, totalProfit, symbol, startDate, endDate, episodesForTraining } = metrics || {};

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <BarChart />
          Performance Report {symbol && `(${symbol})`}
        </CardTitle>
        {startDate && endDate && !isLoading && (
          <CardDescription>
            Backtest period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <MetricItem icon={IndianRupee} label="Initial Balance" value={initialBalance} isLoading={isLoading} unit="₹" />
        <MetricItem icon={IndianRupee} label="Final Balance" value={finalBalance} isLoading={isLoading} unit="₹" />
        <MetricItem icon={IndianRupee} label="Total Profit" value={totalProfit} isLoading={isLoading} unit="₹" />
        <MetricItem icon={CalendarDays} label="Training Episodes" value={episodesForTraining} isLoading={isLoading} />
      </CardContent>
      {(aiSummary || isAiSummaryLoading) && (
        <CardFooter className="flex flex-col items-start gap-2 pt-4 border-t">
          <h3 className="flex items-center gap-2 text-md font-semibold text-primary">
            <Sparkles size={18} /> AI Analysis
          </h3>
          {isAiSummaryLoading ? (
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{aiSummary}</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
