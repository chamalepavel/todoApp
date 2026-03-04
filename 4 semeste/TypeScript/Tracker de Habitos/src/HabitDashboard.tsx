import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import { useHabitStats } from './hooks/useHabitStats';

const HabitDashboard: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);
  const stats = useHabitStats(habits);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #4facfe, #00f2fe)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '35px',
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            color: '#1a202c',
            fontSize: '2.5rem',
            fontWeight: '800',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em'
          }}>
            Mi Tracker de Hábitos
          </h1>
          <p style={{
            color: '#4a5568',
            fontSize: '1.1rem',
            margin: '0',
            fontWeight: '500'
          }}>
            Construye mejores hábitos, día a día
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '35px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #48bb78, #38a169)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(72, 187, 120, 0.25)'
          }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
              {stats.totalHabits}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
              Hábitos Activos
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4299e1, #3182ce)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(66, 153, 225, 0.25)'
          }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>✓</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
              {stats.completedHabits}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
              Completados Hoy
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(237, 137, 54, 0.25)'
          }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
              {stats.completionPercentage.toFixed(0)}%
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
              Éxito Total
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          marginBottom: '35px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              color: '#1a202c',
              marginBottom: '20px',
              fontSize: '1.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Nuevo Hábito
            </h2>
            <HabitForm />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              color: '#1a202c',
              marginBottom: '20px',
              fontSize: '1.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Mis Hábitos
            </h2>
            <HabitList />
          </div>
        </div>

        {/* Progress Overview */}
        {stats.totalHabits > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{
              color: '#1a202c',
              marginBottom: '20px',
              fontSize: '1.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Mi Progreso
            </h2>
            <div style={{
              width: '100%',
              height: '16px',
              backgroundColor: '#e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                width: `${stats.completionPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #48bb78, #38a169)',
                borderRadius: '8px'
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#4a5568',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              <span>Progreso: {stats.completionPercentage.toFixed(1)}%</span>
              <span>{stats.completedHabits} de {stats.totalHabits} hábitos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitDashboard;
