import './config/env';
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import miscRoutes from './routes/misc.routes';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', tripRoutes);
app.use('/api', miscRoutes);

// Global error handler
app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`🚀 Traveloop API running on port ${env.PORT}`);
});

export default app;
