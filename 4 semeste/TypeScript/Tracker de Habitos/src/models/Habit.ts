export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
}

export function formatHabit(h: Habit): string {
  return `Hábito: ${h.name} – Categoría: ${h.category} – Frecuencia: ${h.frequency}`;
}
