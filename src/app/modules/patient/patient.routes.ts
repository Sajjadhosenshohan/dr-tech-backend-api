// patient.routes.ts
import { Router } from 'express';
import { UserRole } from '../user/user.constant';
import { PatientControllers } from './patient.controllers';
import auth from '../../middlewares/authValidation';

const patientRouter = Router();

// Protected routes
patientRouter.get(
  '/profile',
  auth(UserRole.Patient),
  PatientControllers.getPatientProfile,
);
// Get Patient Appointment
patientRouter.get(
  '/appointment',
  auth(UserRole.Patient),
  PatientControllers.getLoggedInUSerAppointment,
);



export const PatientRoutes = patientRouter;
