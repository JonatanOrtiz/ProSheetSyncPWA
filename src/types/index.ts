export interface User {
  uid: string;
  email: string;
  displayName?: string;
  needsPasswordChange?: boolean;
}

export interface SheetData {
  sheetId: string;
  sheetUrl: string;
  sheetTitle: string;
  data: any[][];
  rowCount: number;
  createdAt: any;
  error?: string;
}

export type ServiceType = 'personal' | 'nutricao' | 'coach' | 'other';

export interface Service {
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  spreadsheets: SheetData[];
}

export interface Professional {
  professionalId: string;
  professionalEmail: string;
  professionalName: string;
  professionalPhoto?: string;
  services: Service[];
}

export interface ClientData {
  clientEmail: string;
  clientName: string;
  totalSpreadsheets: number;
  professionals: Professional[];
  lastUpdated: string;
}

// Workout types (Personal Trainer)
export interface ExerciseData {
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  weight?: string;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string;
  exercises: ExerciseData[];
}

// Meal types (Nutricionista)
export interface FoodItem {
  name: string;
  quantity?: string;
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export interface Meal {
  mealName: string;
  time?: string;
  foods: FoodItem[];
}

// Goal types (Coach)
export interface Goal {
  goalName: string;
  description?: string;
  target?: string;
  current?: string;
  progress?: number;
  deadline?: string;
}

// Theme types
export type ThemeMode = 'light' | 'dark';
