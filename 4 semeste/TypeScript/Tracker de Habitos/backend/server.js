const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar SQLite
const dbPath = path.join(__dirname, 'habits.db');
const db = new sqlite3.Database(dbPath);

// Crear tablas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      frequency TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      streak INTEGER DEFAULT 0,
      total_completions INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER,
      date TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (habit_id) REFERENCES habits (id)
    )
  `);
});

// API Routes
app.get('/api/habits', (req, res) => {
  db.all('SELECT * FROM habits ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/habits', (req, res) => {
  const { name, category, frequency } = req.body;
  const sql = 'INSERT INTO habits (name, category, frequency) VALUES (?, ?, ?)';
  
  db.run(sql, [name, category, frequency], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, category, frequency });
  });
});

app.put('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, frequency, completed } = req.body;
  
  const updateCompleted = completed !== undefined ? 
    `, completed_at = ${completed ? 'CURRENT_TIMESTAMP' : 'NULL'}` : '';
    
  const sql = `UPDATE habits SET name = ?, category = ?, frequency = ?${updateCompleted} WHERE id = ?`;
  
  db.run(sql, [name, category, frequency, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Habit updated successfully' });
  });
});

app.delete('/api/habits/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM habits WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Habit deleted successfully' });
  });
});

app.post('/api/habits/:id/complete', (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];
  
  // Verificar si ya se completó hoy
  db.get('SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?', [id, today], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row) {
      // Actualizar existente
      db.run('UPDATE habit_logs SET completed = ? WHERE id = ?', [!row.completed, row.id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Habit completion toggled', completed: !row.completed });
      });
    } else {
      // Crear nuevo
      db.run('INSERT INTO habit_logs (habit_id, date, completed) VALUES (?, ?, ?)', [id, today, 1], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Habit marked as completed', completed: true });
      });
    }
  });
});

app.get('/api/habits/:id/stats', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM habits WHERE id = ?', [id], (err, habit) => {
    if (err || !habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }
    
    db.all('SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY date DESC', [id], (err, logs) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Calcular streak
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < logs.length; i++) {
        const logDate = new Date(logs[i].date);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (logs[i].completed && 
            logDate.toDateString() === expectedDate.toDateString()) {
          streak++;
        } else {
          break;
        }
      }
      
      const completedLogs = logs.filter(log => log.completed).length;
      
      res.json({
        ...habit,
        currentStreak: streak,
        totalCompletions: completedLogs,
        completionRate: logs.length > 0 ? (completedLogs / logs.length) * 100 : 0
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
