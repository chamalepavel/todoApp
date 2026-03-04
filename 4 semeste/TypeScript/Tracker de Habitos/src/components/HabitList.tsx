import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { toggleHabit, removeHabit } from '../features/habits/habitsSlice';
import GenericList from './GenericList';
import HabitCard from './HabitCard';

const HabitList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);
  const dispatch = useDispatch();

  const handleToggle = (id: string) => {
    dispatch(toggleHabit(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeHabit(id));
  };

  if (habits.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
        borderRadius: '15px',
        border: '2px dashed #cbd5e0'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
        <h3 style={{ 
          color: '#4a5568', 
          marginBottom: '10px',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          No hay hábitos registrados
        </h3>
        <p style={{ 
          color: '#718096', 
          fontSize: '1rem',
          margin: '0'
        }}>
          Comienza agregando tu primer hábito para transformar tu vida
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxHeight: '500px',
      overflowY: 'auto',
      paddingRight: '10px'
    }}>
      <GenericList
        items={habits}
        renderItem={(habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={handleToggle}
            onRemove={handleRemove}
          />
        )}
      />
    </div>
  );
};

export default HabitList;
