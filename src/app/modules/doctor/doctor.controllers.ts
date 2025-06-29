import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DoctorServices } from './doctor.services';

const registerDoctor = catchAsync(async (req, res) => {
  const output = await DoctorServices.addDoctorToSystem(req.body);
  res.cookie('dr_tech_token', output?.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 10,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor registration completed',
    data: output,
  });
});

const retrieveDoctors = catchAsync(async (req, res) => {
  const filter = req.query;
  const output = await DoctorServices.fetchAllDoctors(filter);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor list fetched successfully',
    data: output,
  });
});

const retrieveDoctorAppointments = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { status } = req.query;
  const output = await DoctorServices.fetchDoctorAppointments(
    userId,
    status as 'pending' | 'accepted' | 'cancelled' | 'completed',
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor appointments retrieved successfully',
    data: output,
  });
});

const doctorDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const output = await DoctorServices.viewDoctorProfile(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor profile loaded',
    data: output,
  });
});

export const DoctorControllers = {
  registerDoctor,
  retrieveDoctors,
  retrieveDoctorAppointments,
  doctorDetails,
};
