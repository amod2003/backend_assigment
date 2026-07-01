import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Session from '../models/Session';
import Teacher from '../models/Teacher';
import User from '../models/User';

export const createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { teacherId, startTime, endTime } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      res.status(404).json({ success: false, message: 'Teacher not found' });
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      res.status(400).json({ success: false, message: 'endTime must be greater than startTime' });
      return;
    }

    const session = await Session.create({ teacherId, startTime, endTime });
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

export const getAvailableSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dateTimestamp } = req.query;

    if (!dateTimestamp || isNaN(Number(dateTimestamp))) {
      res.status(400).json({ success: false, message: 'Valid dateTimestamp query param is required' });
      return;
    }

    const date = new Date(Number(dateTimestamp));
    const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

    const sessions = await Session.aggregate([
      {
        $match: {
          status: 'AVAILABLE',
          startTime: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'teacherId',
          foreignField: '_id',
          as: 'teacher',
        },
      },
      { $unwind: '$teacher' },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          status: 1,
          'teacher.fullName': 1,
          'teacher.specialization': 1,
          'teacher.experience': 1,
        },
      },
      { $sort: { startTime: 1 } },
    ]);

    res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    next(err);
  }
};

export const bookSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }

    if (session.status !== 'AVAILABLE') {
      res.status(400).json({ success: false, message: 'Session is not available for booking' });
      return;
    }

    session.userId = new Types.ObjectId(userId);
    session.status = 'BOOKED';
    await session.save();

    res.status(200).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};

export const completeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found' });
      return;
    }

    if (session.status !== 'BOOKED') {
      res.status(400).json({ success: false, message: 'Only BOOKED sessions can be marked as completed' });
      return;
    }

    session.status = 'COMPLETED';
    session.completedAt = new Date();
    await session.save();

    res.status(200).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};
