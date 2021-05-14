import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import mongoose from 'mongoose';
import morgan from 'morgan';

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(process.env.PORT);
