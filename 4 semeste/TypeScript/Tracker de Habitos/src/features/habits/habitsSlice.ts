import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '../../models/Habit';

interface HabitsState {
  habits: Habit[];
}

const initialState: HabitsState = {
  habits: [],
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<Omit<Habit, 'id' | 'completed'>>) => {
      const newHabit: Habit = {
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
      };
      state.habits.push(newHabit);
    },
    toggleHabit: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h.id === action.payload);
      if (habit) {
        habit.completed = !habit.completed;
      }
    },
    removeHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(h => h.id !== action.payload);
    },
  },
});

export const { addHabit, toggleHabit, removeHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
