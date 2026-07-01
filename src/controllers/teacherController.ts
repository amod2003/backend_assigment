import { Request, Response, NextFunction } from 'express';
import Teacher from '../models/Teacher';

export const createTeacher = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    next(err);
  }
};
