export interface StockDataPoint {
  date: string; // "YYYY-MM-DD" or timestamp
  close: number;
  sma5?: number;
  sma20?: number;
  returns?: number;
  action?: 'BUY' | 'SELL' | 'HOLD'; // For plotting actions on chart
}

export interface PerformanceMetrics {
  initialBalance: number;
  finalBalance: number;
  totalProfit: number;
  symbol: string;
  startDate: string;
  endDate: string;
  episodesForTraining: number;
}

export interface Hyperparameters {
  gamma: number; // Discount factor
  epsilon: number; // Exploration rate
  epsilonMin: number;
  epsilonDecay: number;
  learningRate: number;
  episodes: number; 
  batchSize: number;
}

export interface EpisodeData {
  episode: number;
  totalReward: number;
}

export interface ChartConfigType {
  [key: string]: {
    label: string;
    color: string;
  };
}
