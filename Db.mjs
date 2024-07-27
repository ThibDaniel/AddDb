const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const db = pgp('postgres://username:password@localhost:5432/planets_db');
const app = express();
app.use(bodyParser.json());

app.get('/planets', async (req, res) => {
  try {
    const planets = await db.any('SELECT * FROM planets');
    res.json(planets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/planets/:id', async (req, res) => {
  try {
    const planet = await db.one('SELECT * FROM planets WHERE id=$1', [req.params.id]);
    res.json(planet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/planets', async (req, res) => {
  try {
    const { name } = req.body;
    await db.none('INSERT INTO planets (name) VALUES ($1)', [name]);
    res.status(201).json({ message: 'Planet added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/planets/:id', async (req, res) => {
  try {
    const { name } = req.body;
    await db.none('UPDATE planets SET name=$2 WHERE id=$1', [req.params.id, name]);
    res.json({ message: 'Planet updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/planets/:id', async (req, res) => {
  try {
    await db.none('DELETE FROM planets WHERE id=$1', [req.params.id]);
    res.json({ message: 'Planet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



//



const pgp = require('pg-promise')();
const db = pgp('postgres://username:password@localhost:5432/planets_db'); // Modifica con le tue credenziali

async function setupDb() {
  try {
    await db.none('DROP TABLE IF EXISTS planets');
    await db.none(`CREATE TABLE planets(
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
    )`);
    await db.none('INSERT INTO planets (name) VALUES ($1)', ['Earth']);
    await db.none('INSERT INTO planets (name) VALUES ($1)', ['Mars']);
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

setupDb();