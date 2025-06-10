"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/DatePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Rocket, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const BacktestFormSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").toUpperCase(),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
});

type BacktestFormValues = z.infer<typeof BacktestFormSchema>;

interface BacktestControlsProps {
  onRunBacktest: (values: BacktestFormValues) => void;
  isLoading: boolean;
}

export function BacktestControls({ onRunBacktest, isLoading }: BacktestControlsProps) {
  const { toast } = useToast();
  const form = useForm<BacktestFormValues>({
    resolver: zodResolver(BacktestFormSchema),
    defaultValues: {
      symbol: "AAPL",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2025-02-14"),
    },
  });

  function onSubmit(data: BacktestFormValues) {
    if (data.endDate <= data.startDate) {
      form.setError("endDate", { type: "manual", message: "End date must be after start date." });
      return;
    }
    toast({ title: "Backtest Initiated", description: `Running backtest for ${data.symbol}...` });
    onRunBacktest(data);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search size={20} />
          Backtest Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AAPL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                   <DatePicker date={field.value} setDate={field.onChange} placeholder="Select start date" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} placeholder="Select end date" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Rocket size={18} className="mr-2" />
              {isLoading ? "Running..." : "Run Backtest"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
