import { useMemo } from 'react';
import { Habit } from '../models/Habit';

interface HabitStats {
  totalHabits: number;
  completedHabits: number;
  completionPercentage: number;
}

export function useHabitStats(habits: Habit[]): HabitStats {
  return useMemo(() => {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completed).length;
    const completionPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
    return {
      totalHabits,
      completedHabits,
      completionPercentage,
    };
  }, [habits]);
}
