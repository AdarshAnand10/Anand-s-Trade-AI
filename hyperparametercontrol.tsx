
"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; 
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info, Settings2, Bot } from 'lucide-react'; 
import { explainHyperparameter, ExplainHyperparameterOutput } from '@/ai/flows/hyperparameter-explanation';
import type { Hyperparameters } from '@/types';
import { useToast } from "@/hooks/use-toast";

const HyperparameterFormSchema = z.object({
  gamma: z.number().min(0).max(1),
  epsilon: z.number().min(0).max(1),
  epsilonMin: z.number().min(0.001).max(0.1),
  epsilonDecay: z.number().min(0.9).max(0.999),
  learningRate: z.number().min(0.0001).max(0.01),
  episodes: z.number().min(10).max(1000).int(),
  batchSize: z.number().min(8).max(128).int(),
});

type HyperparameterFormValues = z.infer<typeof HyperparameterFormSchema>;

interface HyperparameterControlsProps {
  onTrainAgent: (values: HyperparameterFormValues) => void;
  isLoading: boolean;
  initialHyperparameters: Hyperparameters;
}

interface HyperparameterItemProps {
  name: keyof HyperparameterFormValues;
  label: string;
  control: any; 
  min: number;
  max: number;
  step: number;
  isSlider?: boolean;
  defaultValue: number;
}

function HyperparameterItem({ name, label, control, min, max, step, isSlider = false, defaultValue }: HyperparameterItemProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);

  const fetchExplanation = async () => {
    if (explanation) return; 
    setIsFetchingExplanation(true);
    try {
      const result: ExplainHyperparameterOutput = await explainHyperparameter({ hyperparameterName: label });
      setExplanation(result.explanation);
    } catch (error) {
      console.error("Failed to fetch explanation:", error);
      setExplanation("Could not load explanation.");
    } finally {
      setIsFetchingExplanation(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild onMouseOver={fetchExplanation}>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 text-sm" side="top" align="end">
                {isFetchingExplanation ? "Loading explanation..." : explanation || "Hover to load explanation."}
              </PopoverContent>
            </Popover>
          </div>
          <FormControl>
            <div>
              <Input
                type="number"
                min={min}
                max={max}
                step={step}
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="mb-2"
              />
              {isSlider && (
                <Slider
                  defaultValue={[defaultValue]}
                  min={min}
                  max={max}
                  step={step}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


export function HyperparameterControls({ onTrainAgent, isLoading, initialHyperparameters }: HyperparameterControlsProps) {
  const { toast } = useToast();
  const form = useForm<HyperparameterFormValues>({
    resolver: zodResolver(HyperparameterFormSchema),
    defaultValues: initialHyperparameters,
  });

  function onSubmit(data: HyperparameterFormValues) {
    toast({ title: "Training Initiated", description: "AI Agent training with new hyperparameters..."});
    onTrainAgent(data);
  }
  
  const hyperparameterFields: HyperparameterItemProps[] = [
    { name: "gamma", label: "Discount Factor (Gamma)", control: form.control, min: 0.8, max: 0.99, step: 0.001, isSlider: true, defaultValue: initialHyperparameters.gamma },
    { name: "epsilon", label: "Exploration Rate (Epsilon)", control: form.control, min: 0.1, max: 1.0, step: 0.01, isSlider: true, defaultValue: initialHyperparameters.epsilon  },
    { name: "epsilonMin", label: "Min Exploration Rate", control: form.control, min: 0.001, max: 0.1, step: 0.001, isSlider: true, defaultValue: initialHyperparameters.epsilonMin  },
    { name: "epsilonDecay", label: "Exploration Decay", control: form.control, min: 0.9, max: 0.999, step: 0.001, isSlider: true, defaultValue: initialHyperparameters.epsilonDecay  },
    { name: "learningRate", label: "Learning Rate", control: form.control, min: 0.0001, max: 0.01, step: 0.0001, isSlider: true, defaultValue: initialHyperparameters.learningRate  },
    { name: "episodes", label: "Training Episodes", control: form.control, min: 10, max: 1000, step: 10, defaultValue: initialHyperparameters.episodes  },
    { name: "batchSize", label: "Batch Size", control: form.control, min: 8, max: 128, step: 4, defaultValue: initialHyperparameters.batchSize  },
  ];


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 size={20} />
          Hyperparameter Tuning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {hyperparameterFields.map(props => <HyperparameterItem key={props.name} {...props} />)}
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Bot size={18} className="mr-2" />
              {isLoading ? "Training..." : "Train Agent"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
