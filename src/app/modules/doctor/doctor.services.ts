/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/auth.utils';
import { Doctor } from './doctor.model';
import { User } from '../user/user.model';
import { Hospital } from '../hospital/hospital.model';
import { Specialization } from '../specialization/specialization.model';
import { Appointment } from '../appointment/appointment.model';
import { Service } from '../service/service.model';
import { Availability } from '../availability/availability.mode';

const addDoctorToSystem = async (info: any) => {
  const { phone, specialization, hospitalName, name, email, password } = info;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError(400, 'Doctor already exists!');

  const specCheck = await Specialization.findById(specialization);
  if (!specCheck) throw new AppError(400, 'Invalid Specialization!');

  const hospCheck = await Hospital.findById(hospitalName);
  if (!hospCheck) throw new AppError(400, 'Hospital not found!');

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userDoc = await User.create(
      [{ name, email, password, role: 'Doctor' }],
      { session },
    );

    await Doctor.create(
      [
        {
          userId: userDoc[0]._id,
          phone,
          specialization,
          hospitalName,
        },
      ],
      { session },
    );

    const payload = {
      userEmail: userDoc[0]?.email,
      role: userDoc[0]?.role,
      userId: userDoc[0]?._id,
    };

    const token = createToken(
      payload,
      config.JWT_ACCESS_TOKEN_SECRET as string,
      config.JWT_ACCESS_EXPIRES_IN as string,
    );

    await session.commitTransaction();
    session.endSession();

    return { accessToken: token };
  } catch  {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, 'Doctor creation failed');
  }
};

const fetchAllDoctors = async (query: Record<string, unknown>) => {
  const matchStage: any = {};
  const exclude = ['sort', 'limit', 'page', 'fields'];

  for (const key in query) {
    if (exclude.includes(key)) continue;
    const value = query[key];
    if (key.includes('.')) {
      const [field, sub] = key.split('.');
      matchStage[`${field}.${sub}`] = value;
    } else {
      matchStage[key] = value;
    }
  }
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Doctor.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'specializations',
        localField: 'specialization',
        foreignField: '_id',
        as: 'specialization',
      },
    },
    { $unwind: '$specialization' },
    {
      $lookup: {
        from: 'hospitals',
        localField: 'hospitalName',
        foreignField: '_id',
        as: 'hospital',
      },
    },
    { $unwind: '$hospital' },
    { $match: matchStage },
    {
      $project: {
        _id: 1,
        phone: 1,
        'user._id': 1,
        'user.name': 1,
        'user.email': 1,
        'user.role': 1,
        'specialization._id': 1,
        'specialization.name': 1,
        'hospital._id': 1,
        'hospital.name': 1,
        'hospital.floor': 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const totalCount = await Doctor.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'specializations',
        localField: 'specialization',
        foreignField: '_id',
        as: 'specialization',
      },
    },
    { $unwind: '$specialization' },
    {
      $lookup: {
        from: 'hospitals',
        localField: 'hospitalName',
        foreignField: '_id',
        as: 'hospital',
      },
    },
    { $unwind: '$hospital' },
    { $match: matchStage },
    { $count: 'total' },
  ]);

  const meta = {
    page,
    limit,
    total: totalCount[0]?.total || 0,
    totalPage: Math.ceil((totalCount[0]?.total || 0) / limit),
  };

  return {
    meta,
    result,
  };
};

const fetchDoctorAppointments = async (
  userId: string,
  status?: 'pending' | 'accepted' | 'cancelled' | 'completed',
) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) throw new AppError(404, 'Doctor not found');

  const filter: any = { doctorId: doctor._id };
  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate({
      path: 'patientId',
      model: 'User',
      select: 'name email',
    })
    .populate({
      path: 'serviceId',
      model: 'Service',
      select: 'title',
    })
    .populate({
      path: 'doctorId',
      model: 'Doctor',
      select: 'phone',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'name email',
      },
    });

  return appointments;
};

const viewDoctorProfile = async (id: string) => {
  const doctor = await Doctor.findOne({ _id: id })
    .select('_id phone userId specialization hospitalName')
    .populate('userId', '_id name email role')
    .populate('specialization', '_id name')
    .populate('hospitalName', '_id name floor')
    .lean();

  if (!doctor) throw new AppError(404, 'Doctor profile not found');

  const services = await Service.find({ doctor: doctor._id });
  const availabilities = await Availability.find({ doctor: doctor._id });

  return {
    doctor,
    services,
    availabilities,
  };
};

export const DoctorServices = {
  addDoctorToSystem,
  fetchAllDoctors,
  fetchDoctorAppointments,
  viewDoctorProfile,
};
