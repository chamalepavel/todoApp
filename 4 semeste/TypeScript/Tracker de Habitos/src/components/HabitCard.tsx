import React from 'react';
import { Habit } from '../models/Habit';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onRemove }) => {
  return (
    <div style={{
      background: habit.completed 
        ? 'linear-gradient(135deg, #d5f4e6, #c8e6c9)' 
        : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
      border: habit.completed 
        ? '1px solid #4caf50' 
        : '1px solid #e0e0e0',
      borderRadius: '10px',
      padding: '16px',
      margin: '12px 0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#2c3e50',
            textDecoration: habit.completed ? 'line-through' : 'none',
            opacity: habit.completed ? 0.7 : 1
          }}>
            {habit.name}
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <span style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {habit.category}
            </span>
            
            <span style={{
              color: '#666',
              fontSize: '12px'
            }}>
              {habit.frequency === 'daily' ? 'Diario' : 
               habit.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
            </span>
          </div>
        </div>
        
        {habit.completed && (
          <div style={{
            background: '#4caf50',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            Hecho
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => onToggle(habit.id.toString())}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: habit.completed 
              ? '#ff9800' 
              : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {habit.completed ? 'Deshacer' : 'Listo'}
        </button>
        
        <button
          onClick={() => onRemove(habit.id.toString())}
          style={{
            padding: '8px 12px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
