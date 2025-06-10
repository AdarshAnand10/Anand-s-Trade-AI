"use client";

import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockDataPoint, ChartConfigType } from '@/types';
import { ChartTooltipContent, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

interface StockChartProps {
  data: StockDataPoint[];
  symbol: string | null;
}

const chartConfig = {
  close: { label: 'Close Price', color: 'hsl(var(--chart-1))' },
  sma5: { label: 'SMA 5', color: 'hsl(var(--chart-2))' },
  sma20: { label: 'SMA 20', color: 'hsl(var(--chart-3))' },
  returns: { label: 'Returns', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfigType;


export function StockChart({ data, symbol }: StockChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-headline">
            <TrendingUp />
            Stock Performance: {symbol || "N/A"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available to display chart. Run a backtest to see results.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
  }));


  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <TrendingUp />
         Stock Performance: {symbol || "N/A"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={formattedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="hsl(var(--primary))" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `₹${value.toFixed(2)}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--accent))" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
              />
              <Tooltip
                content={<ChartTooltipContent 
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value, name) => {
                    if (name === 'returns') return [`${(Number(value) * 100).toFixed(2)}%`, chartConfig[name as keyof typeof chartConfig]?.label || name as string];
                    return [`₹${Number(value).toFixed(2)}`, chartConfig[name as keyof typeof chartConfig]?.label || name as string];
                  }}
                  cursorClassName="fill-muted"
                  wrapperClassName="rounded-lg border bg-background p-2 shadow-sm"
                />}
              />
              <Legend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="close" stroke={chartConfig.close.color} strokeWidth={2} yAxisId="left" dot={false} name="Close Price" />
              {data.some(d => d.sma5 !== undefined) && 
                <Line type="monotone" dataKey="sma5" stroke={chartConfig.sma5.color} strokeDasharray="5 5" yAxisId="left" dot={false} name="SMA 5" />
              }
              {data.some(d => d.sma20 !== undefined) && 
                <Line type="monotone" dataKey="sma20" stroke={chartConfig.sma20.color} strokeDasharray="10 5" yAxisId="left" dot={false} name="SMA 20" />
              }
              {data.some(d => d.returns !== undefined) &&
                <Bar dataKey="returns" yAxisId="right" fill={chartConfig.returns.color} name="Returns" barSize={10} />
              }
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
