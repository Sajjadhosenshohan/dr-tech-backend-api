import { Router } from 'express';
import { AuthController } from './auth.controllers';
import requestValidation from '../../middlewares/requestValidation';
import { DoctorValidation } from '../doctor/doctor.validation.schema';
import { DoctorControllers } from '../doctor/doctor.controllers';

// User Router
const authRouter = Router();

// Create User
authRouter.post(
  '/login',

  AuthController.handleUserLogin,
);

// Create Doctor
authRouter.post(
  '/register-doctor',
  requestValidation(DoctorValidation.createDoctorValidationSchema),
  DoctorControllers.registerDoctor,
);
// // Create Patient
// authRouter.post(
//   '/register-patient',
//   requestValidation(PatientsValidationSchemas.createPatientValidationSchema),
//   PatientControllers.createPatient,
// );

// LoggedIn User
authRouter.get('/me', AuthController.fetchLoggedInUser);

// Export User Router
export const AuthRoutes = authRouter;
