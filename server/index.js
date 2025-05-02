// File: server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();
app.use(cors());
app.use(express.json());

// Fetch all jobs
app.get('/jobs', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM jobs ORDER BY id');
  res.json(rows);
});

// Fetch job by ID
app.get('/jobs/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Job not found' });
  res.json(rows[0]);
});

// Save favorite job
app.post('/favorites', async (req, res) => {
  const { jobId } = req.body;
  await pool.query('INSERT INTO favorites (job_id) VALUES ($1) ON CONFLICT DO NOTHING', [jobId]);
  res.json({ status: 'saved' });
});

// Get favorite jobs
app.get('/favorites', async (req, res) => {
  const { rows } = await pool.query('SELECT j.* FROM favorites f JOIN jobs j ON j.id = f.job_id');
  res.json(rows);
});

// Save applied job
app.post('/applied', async (req, res) => {
  const { jobId } = req.body;
  await pool.query('INSERT INTO applied (job_id) VALUES ($1) ON CONFLICT DO NOTHING', [jobId]);
  res.json({ status: 'applied' });
});

// Get applied jobs
app.get('/applied', async (req, res) => {
  const { rows } = await pool.query('SELECT j.* FROM applied a JOIN jobs j ON j.id = a.job_id');
  res.json(rows);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
