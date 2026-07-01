import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import teacherRoutes from './routes/teacherRoutes';
import sessionRoutes from './routes/sessionRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/users', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/sessions', sessionRoutes);

app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

export default app;
