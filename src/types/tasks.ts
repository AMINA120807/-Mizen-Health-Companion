export type TaskFrequency = 'daily' | 'weekly' | 'custom';
export type TaskCategory = 'hydration' | 'medication' | 'activity' | 'nutrition' | 'mindfulness' | 'other';

export interface DailyTask {
  id: string;
  title: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  
  // For tasks like "Drink 8 glasses of water"
  targetCount: number;
  currentCount: number;
  
  // For measuring specific units (e.g., 'ml', 'steps', 'mins')
  unit?: string;
  
  // Specific times of day for reminders
  reminderTimes?: string[]; 
  
  // History of completion dates (ISO strings)
  completionHistory: string[];
  
  createdAt: string;
}

export interface TaskState {
  tasks: DailyTask[];
  lastUpdated: string;
}
