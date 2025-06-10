
"use client";

import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  // SidebarSeparator, // Not used
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TradeAiLogo } from '@/components/icons/TradeAiLogo'; 
import { BacktestControls } from '@/components/dashboard/BacktestControls';
import { HyperparameterControls } from '@/components/dashboard/HyperparameterControls';
import { StockChart } from '@/components/dashboard/StockChart';
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary';
import { EpisodePerformanceChart } from '@/components/dashboard/EpisodePerformanceChart';
import type { StockDataPoint, PerformanceMetrics, Hyperparameters, EpisodeData } from '@/types';
import { analyzeStockSummary, AnalyzeStockSummaryInput } from '@/ai/flows/analyze-stock-summary';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';


// Mock data and functions
const generateMockStockData = (startDate: Date, endDate: Date): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let currentDate = new Date(startDate);
  let lastClose = 150 + Math.random() * 50;

  while (currentDate <= endDate) {
    const change = (Math.random() - 0.48) * 5; 
    const close = Math.max(10, lastClose + change); 
    const returns = (close - lastClose) / lastClose;
    data.push({
      date: currentDate.toISOString().split('T')[0],
      close: parseFloat(close.toFixed(2)),
      returns: parseFloat(returns.toFixed(4)),
    });
    lastClose = close;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  data.forEach((d, i) => {
    if (i >= 4) {
      d.sma5 = parseFloat(data.slice(i-4, i+1).reduce((sum, curr) => sum + curr.close, 0) / 5).toFixed(2) as any;
    }
    if (i >= 19) {
      d.sma20 = parseFloat(data.slice(i-19, i+1).reduce((sum, curr) => sum + curr.close, 0) / 20).toFixed(2) as any;
    }
  });
  return data;
};

const generateMockEpisodeData = (numEpisodes: number): EpisodeData[] => {
  const data: EpisodeData[] = [];
  let currentReward = Math.random() * 100 - 50; 
  for (let i = 1; i <= numEpisodes; i++) {
    currentReward += (Math.random() - 0.45) * 20 + (i / numEpisodes) * 10; 
    data.push({
      episode: i,
      totalReward: parseFloat(currentReward.toFixed(2)),
    });
  }
  return data;
};

const initialHyperparams: Hyperparameters = {
  gamma: 0.95,
  epsilon: 1.0,
  epsilonMin: 0.01,
  epsilonDecay: 0.995,
  learningRate: 0.001,
  episodes: 50,
  batchSize: 32,
};

export default function DashboardPage() {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [episodeData, setEpisodeData] = useState<EpisodeData[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>("AAPL");
  
  const [isBacktestLoading, setIsBacktestLoading] = useState(false);
  const [isTrainingLoading, setIsTrainingLoading] = useState(false);
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const [hyperparameters, setHyperparameters] = useState<Hyperparameters>(initialHyperparams);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    handleRunBacktest({ symbol: "AAPL", startDate: new Date("2023-01-01"), endDate: new Date("2023-12-31") });
    handleTrainAgent(initialHyperparams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunBacktest = async (values: { symbol: string, startDate: Date, endDate: Date }) => {
    setIsBacktestLoading(true);
    setAiSummary(null); 
    setCurrentSymbol(values.symbol);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData = generateMockStockData(values.startDate, values.endDate);
    setStockData(mockData);

    const initialBalance = 10000;
    const finalBalance = initialBalance + (Math.random() - 0.3) * 5000; 
    const profit = finalBalance - initialBalance;

    const metrics: PerformanceMetrics = {
      initialBalance: parseFloat(initialBalance.toFixed(2)),
      finalBalance: parseFloat(finalBalance.toFixed(2)),
      totalProfit: parseFloat(profit.toFixed(2)),
      symbol: values.symbol,
      startDate: values.startDate.toISOString().split('T')[0],
      endDate: values.endDate.toISOString().split('T')[0],
      episodesForTraining: hyperparameters.episodes,
    };
    setPerformanceMetrics(metrics);
    setIsBacktestLoading(false);

    setIsAiSummaryLoading(true);
    try {
      const summaryInput: AnalyzeStockSummaryInput = {
        initialBalance: metrics.initialBalance,
        finalBalance: metrics.finalBalance,
        totalProfit: metrics.totalProfit,
        episodes: metrics.episodesForTraining,
        symbol: metrics.symbol,
        startDate: metrics.startDate,
        endDate: metrics.endDate,
      };
      const result = await analyzeStockSummary(summaryInput);
      setAiSummary(result.summary);
    } catch (error) {
      console.error("Failed to fetch AI summary:", error);
      setAiSummary("Could not load AI summary.");
    } finally {
      setIsAiSummaryLoading(false);
    }
  };

  const handleTrainAgent = async (values: Hyperparameters) => {
    setIsTrainingLoading(true);
    setHyperparameters(values); 
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockEpisodeData = generateMockEpisodeData(values.episodes);
    setEpisodeData(mockEpisodeData);
    setIsTrainingLoading(false);
    
    if (performanceMetrics) {
        const updatedMetrics = { ...performanceMetrics, episodesForTraining: values.episodes };
        setPerformanceMetrics(updatedMetrics);
        
        setIsAiSummaryLoading(true);
        try {
          const summaryInput: AnalyzeStockSummaryInput = {
            initialBalance: updatedMetrics.initialBalance,
            finalBalance: updatedMetrics.finalBalance,
            totalProfit: updatedMetrics.totalProfit,
            episodes: updatedMetrics.episodesForTraining,
            symbol: updatedMetrics.symbol,
            startDate: updatedMetrics.startDate,
            endDate: updatedMetrics.endDate,
          };
          const result = await analyzeStockSummary(summaryInput);
          setAiSummary(result.summary);
        } catch (error) {
          console.error("Failed to fetch AI summary:", error);
          setAiSummary("Could not load AI summary.");
        } finally {
          setIsAiSummaryLoading(false);
        }
    }
  };
  
  const ConditionalSidebarTrigger = () => {
    const { open, toggleSidebar, isMobile } = useSidebar(); 
    if (isMobile) { 
       return (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden m-2 absolute top-2 left-2 z-50 bg-background/80 hover:bg-background">
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      );
    }
    return <SidebarTrigger className="hidden md:flex absolute top-4 left-4 z-20 bg-background/80 hover:bg-background" />;
  };


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <TradeAiLogo /> 
          </SidebarHeader>
          {isClient ? (
            <ScrollArea className="h-[calc(100vh-8rem)]"> 
              <SidebarContent className="p-0">
                <SidebarGroup className="p-2">
                  <SidebarGroupLabel className="text-sm px-2">Controls</SidebarGroupLabel>
                  <div className="p-2 space-y-4">
                    <BacktestControls onRunBacktest={handleRunBacktest} isLoading={isBacktestLoading} />
                    <HyperparameterControls onTrainAgent={handleTrainAgent} isLoading={isTrainingLoading} initialHyperparameters={hyperparameters} />
                  </div>
                </SidebarGroup>
              </SidebarContent>
            </ScrollArea>
          ) : (
            <div className="h-[calc(100vh-8rem)]" /> 
          )}
          <SidebarFooter className="p-4 mt-auto border-t">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} TradeAI</p> 
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
           <ConditionalSidebarTrigger/>
          <main className="flex-1 p-4 md:p-8 space-y-8">
            <header className="mb-8">
              <h1 className="text-3xl font-headline font-bold text-foreground">TradeAI Dashboard</h1> 
              <p className="text-muted-foreground">Analyze stock trading performance with AI insights.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <StockChart data={stockData} symbol={currentSymbol} />
              </div>
              <PerformanceSummary metrics={performanceMetrics} aiSummary={aiSummary} isLoading={isBacktestLoading} isAiSummaryLoading={isAiSummaryLoading} />
              <EpisodePerformanceChart data={episodeData} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
