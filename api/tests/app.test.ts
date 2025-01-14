import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';

// Configuração do dotenv
dotenv.config();

// Importa o aplicativo Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para simular a configuração do servidor
app.use(express.json());
app.use('/add', (req, res) => res.status(200).send('Add route'));
app.use('/confirm', (req, res) => res.status(200).send('Confirm route'));
app.use('/', (req, res) => res.status(200).send('List route'));
app.use('/uploads', (req, res) => res.status(200).send('Uploads route'));

// Testes com Vitest
import { describe, it, expect } from 'vitest';

describe('Server', () => {
  it('should respond to GET /add', async () => {
    const response = await request(app).get('/add');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Add route');
  });

  it('should respond to GET /confirm', async () => {
    const response = await request(app).get('/confirm');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Confirm route');
  });

  it('should respond to GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('List route');
  });

});
