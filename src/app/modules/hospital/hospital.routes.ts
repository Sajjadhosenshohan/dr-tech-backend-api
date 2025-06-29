import { Router } from 'express';
import { HospitalControllers } from './hospital.controllers';
import requestValidation from '../../middlewares/requestValidation';
import { HospitalValidation } from './hospital.validation.schema';

// Hospital Router
const hospitalRouter = Router();

// Create Hospital
hospitalRouter.post(
  '/create',
  // auth(UserRole.Admin),
  requestValidation(HospitalValidation.createHospitalZodSchema),
  HospitalControllers.createHospital,
);

// Get All Hospital
hospitalRouter.get('/', HospitalControllers.getAllHospital);
// Get Single Hospital
hospitalRouter.get('/:id', HospitalControllers.getSingleHospital);

// Export Hospital Router
export const HospitalRoutes = hospitalRouter;
