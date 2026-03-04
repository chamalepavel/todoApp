import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addHabit } from '../features/habits/habitsSlice';

interface HabitFormValues {
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

const validationSchema = Yup.object({
  name: Yup.string().min(3, 'Mínimo 3 caracteres').required('Campo obligatorio'),
  category: Yup.string().required('Campo obligatorio'),
  frequency: Yup.string().oneOf(['daily', 'weekly', 'monthly']).required('Campo obligatorio'),
});

const HabitForm: React.FC = () => {
  const dispatch = useDispatch();

  const initialValues: HabitFormValues = {
    name: '',
    category: '',
    frequency: 'daily',
  };

  const handleSubmit = (values: HabitFormValues, { resetForm }: any) => {
    dispatch(addHabit(values));
    resetForm();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="name" 
                style={{ 
                  color: 'white', 
                  display: 'block', 
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Nombre
              </label>
              <Field 
                name="name" 
                type="text" 
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333'
                }}
                placeholder="Ej: Leer 20 minutos"
              />
              <ErrorMessage name="name">
                {msg => <div style={{ color: '#ffeaa7', marginTop: '4px', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="category" 
                style={{ 
                  color: 'white', 
                  display: 'block', 
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Categoría
              </label>
              <Field 
                name="category" 
                as="select" 
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333'
                }}
              >
                <option value="">Selecciona</option>
                <option value="mindset">Mindset</option>
                <option value="health">Salud</option>
                <option value="productivity">Productividad</option>
                <option value="fitness">Ejercicio</option>
                <option value="learning">Estudio</option>
              </Field>
              <ErrorMessage name="category">
                {msg => <div style={{ color: '#ffeaa7', marginTop: '4px', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="frequency" 
                style={{ 
                  color: 'white', 
                  display: 'block', 
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Frecuencia
              </label>
              <Field 
                name="frequency" 
                as="select" 
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333'
                }}
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </Field>
              <ErrorMessage name="frequency">
                {msg => <div style={{ color: '#ffeaa7', marginTop: '4px', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>
            </div>
            
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(45deg, #fd79a8, #e84393)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              Agregar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default HabitForm;
