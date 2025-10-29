import { ExerciseData, WorkoutDay, FoodItem, Meal, Goal } from '@/types';

/**
 * Parses workout data from spreadsheet rows
 * Expected columns: Exercício, Séries, Repetições, Descanso, Peso, Observações
 */
export const parseWorkoutData = (data: any[][]): WorkoutDay[] => {
  if (!data || data.length < 2) return [];

  const headers = data[0].map(h => String(h).toLowerCase().trim());
  const workouts: WorkoutDay[] = [];
  let currentDay: WorkoutDay | null = null;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();

    // Check if this is a day header (e.g., "Segunda-feira", "Dia 1", etc.)
    if (firstCell && !row[1] && !row[2]) {
      // This is likely a day header
      if (currentDay) {
        workouts.push(currentDay);
      }
      currentDay = {
        dayName: firstCell,
        exercises: []
      };
      continue;
    }

    // Parse exercise data
    if (firstCell) {
      const exercise: ExerciseData = {
        name: firstCell,
        sets: row[headers.indexOf('séries')] || row[headers.indexOf('series')] || row[1] || '',
        reps: row[headers.indexOf('repetições')] || row[headers.indexOf('repeticoes')] || row[2] || '',
        rest: row[headers.indexOf('descanso')] || row[3] || '',
        weight: row[headers.indexOf('peso')] || row[headers.indexOf('carga')] || row[4] || '',
        notes: row[headers.indexOf('observações')] || row[headers.indexOf('observacoes')] || row[headers.indexOf('notas')] || row[5] || ''
      };

      if (!currentDay) {
        currentDay = {
          dayName: 'Treino',
          exercises: []
        };
      }

      currentDay.exercises.push(exercise);
    }
  }

  if (currentDay && currentDay.exercises.length > 0) {
    workouts.push(currentDay);
  }

  return workouts.length > 0 ? workouts : [{
    dayName: 'Treino',
    exercises: parseExercisesSimple(data)
  }];
};

const parseExercisesSimple = (data: any[][]): ExerciseData[] => {
  if (!data || data.length < 2) return [];

  const exercises: ExerciseData[] = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;

    exercises.push({
      name: String(row[0]),
      sets: row[1] ? String(row[1]) : '',
      reps: row[2] ? String(row[2]) : '',
      rest: row[3] ? String(row[3]) : '',
      weight: row[4] ? String(row[4]) : '',
      notes: row[5] ? String(row[5]) : ''
    });
  }

  return exercises;
};

/**
 * Parses meal plan data from spreadsheet rows
 * Expected columns: Refeição, Alimento, Quantidade, Calorias, Proteína, Carboidrato, Gordura
 */
export const parseMealPlanData = (data: any[][]): Meal[] => {
  if (!data || data.length < 2) return [];

  const meals: Meal[] = [];
  let currentMeal: Meal | null = null;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const firstCell = String(row[0] || '').trim();
    const secondCell = String(row[1] || '').trim();

    // Check if this is a new meal
    if (firstCell && secondCell) {
      // Check if first cell is a meal name and second is food
      const isMealHeader = firstCell.toLowerCase().includes('café') ||
                          firstCell.toLowerCase().includes('almoço') ||
                          firstCell.toLowerCase().includes('almoco') ||
                          firstCell.toLowerCase().includes('jantar') ||
                          firstCell.toLowerCase().includes('lanche') ||
                          firstCell.toLowerCase().includes('ceia') ||
                          firstCell.toLowerCase().includes('refeição') ||
                          firstCell.toLowerCase().includes('refeicao');

      if (isMealHeader || !currentMeal) {
        if (currentMeal && currentMeal.foods.length > 0) {
          meals.push(currentMeal);
        }
        currentMeal = {
          mealName: firstCell,
          time: '',
          foods: []
        };
      }

      // Add food item
      const food: FoodItem = {
        name: secondCell,
        quantity: row[2] ? String(row[2]) : '',
        calories: row[3] ? parseFloat(String(row[3])) : undefined,
        protein: row[4] ? String(row[4]) : '',
        carbs: row[5] ? String(row[5]) : '',
        fat: row[6] ? String(row[6]) : ''
      };

      if (currentMeal) {
        currentMeal.foods.push(food);
      }
    } else if (firstCell && !secondCell && currentMeal) {
      // This might be a continuation or a meal header
      if (currentMeal.foods.length > 0) {
        meals.push(currentMeal);
      }
      currentMeal = {
        mealName: firstCell,
        time: '',
        foods: []
      };
    }
  }

  if (currentMeal && currentMeal.foods.length > 0) {
    meals.push(currentMeal);
  }

  return meals;
};

/**
 * Parses goal tracking data from spreadsheet rows
 * Expected columns: Meta, Descrição, Valor Alvo, Valor Atual, Progresso (%), Prazo
 */
export const parseGoalData = (data: any[][]): Goal[] => {
  if (!data || data.length < 2) return [];

  const goals: Goal[] = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0]) continue;

    const goal: Goal = {
      goalName: String(row[0]),
      description: row[1] ? String(row[1]) : '',
      target: row[2] ? String(row[2]) : '',
      current: row[3] ? String(row[3]) : '',
      progress: row[4] ? parseFloat(String(row[4])) : undefined,
      deadline: row[5] ? String(row[5]) : ''
    };

    goals.push(goal);
  }

  return goals;
};
