import { BrainCircuit } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export function TradeAiLogo(props: LucideProps) {
  return (
    <div className="flex items-center gap-2">
      <BrainCircuit {...props} className="text-primary" />
      <span className="font-headline text-xl font-semibold text-primary">TradeAI</span>
    </div>
  );
}
