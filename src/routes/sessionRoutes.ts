import { Router } from 'express';
import {
  createSession,
  getAvailableSessions,
  bookSession,
  completeSession,
} from '../controllers/sessionController';

const router = Router();

// GET /available must come before /:id to avoid route collision
router.get('/available', getAvailableSessions);
router.post('/', createSession);
router.post('/:id/book', bookSession);
router.patch('/:id/complete', completeSession);

export default router;
