"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EpisodeData, ChartConfigType } from '@/types';
import { ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Activity } from 'lucide-react';

interface EpisodePerformanceChartProps {
  data: EpisodeData[];
}

const chartConfig = {
  totalReward: { label: 'Total Reward', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfigType;

export function EpisodePerformanceChart({ data }: EpisodePerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <Activity />
            Episode Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No episode data available. Train the agent to see results.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <Activity />
          Episode Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="episode" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                label={{ value: 'Episode', position: 'insideBottom', offset: -5, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--primary))" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                label={{ value: 'Total Reward', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                content={<ChartTooltipContent 
                  formatter={(value, name) => [value, chartConfig[name as keyof typeof chartConfig]?.label || name]}
                  cursorClassName="fill-muted"
                  wrapperClassName="rounded-lg border bg-background p-2 shadow-sm"
                />}
              />
              <Legend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="totalReward" stroke={chartConfig.totalReward.color} strokeWidth={2} dot={false} name="Total Reward" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
