import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import Session from '../models/Session';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUserSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.params.id);

    const userExists = await User.findById(userId);
    if (!userExists) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const result = await Session.aggregate([
      { $match: { userId, status: { $in: ['BOOKED', 'COMPLETED'] } } },
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
        $facet: {
          upcomingSessions: [
            { $match: { status: 'BOOKED' } },
            { $sort: { startTime: 1 } },
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
          ],
          completedSessions: [
            { $match: { status: 'COMPLETED' } },
            { $sort: { completedAt: -1 } },
            {
              $project: {
                startTime: 1,
                endTime: 1,
                status: 1,
                completedAt: 1,
                'teacher.fullName': 1,
                'teacher.specialization': 1,
                'teacher.experience': 1,
              },
            },
          ],
        },
      },
    ]);

    const history = result[0] ?? { upcomingSessions: [], completedSessions: [] };
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};
