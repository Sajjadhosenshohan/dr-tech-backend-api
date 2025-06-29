import { Router } from 'express';
import { UserRole } from '../user/user.constant';
import auth from '../../middlewares/authValidation';
import { DoctorControllers } from './doctor.controllers';
import requestValidation from '../../middlewares/requestValidation';
import { ServiceValidationSchemas } from '../service/services.validation.schema';
import { ServiceControllers } from '../service/service.controllers';
import { AvailabilityValidationSchema } from '../availability/availability.validation.schema';
import { AvailabilityController } from '../availability/availability.controllers';
import { AppointmentController } from '../appointment/appointment.controllers';

// Doctor Router
const doctorRouter = Router();

// Create Services
doctorRouter.post(
  '/services',
  requestValidation(ServiceValidationSchemas.createServiceValidationSchema),
  auth(UserRole.Doctor),
  ServiceControllers.createService,
);

// Create Availability
doctorRouter.post(
  '/availability',
  auth(UserRole.Doctor),
  requestValidation(AvailabilityValidationSchema.createAvailabilitySchema),
  AvailabilityController.createAvailability,
);

// Get All Services
doctorRouter.get(
  '/services',
  auth(UserRole.Doctor),
  ServiceControllers.getAllService,
);

// Get All Availability
doctorRouter.get(
  '/availability',
  auth(UserRole.Doctor),
  AvailabilityController.getAllAvailability,
);

// Get Logged In Doctor Appointments
doctorRouter.get(
  '/appointments',
  auth(UserRole.Doctor),
  DoctorControllers.retrieveDoctorAppointments,
);

// Update Appointment
doctorRouter.patch(
  '/appointments/:id',
  auth(UserRole.Doctor),
  AppointmentController.updateBooking,
);

// Update Availability
doctorRouter.patch(
  '/availability/:id',
  auth(UserRole.Doctor),
  requestValidation(AvailabilityValidationSchema.updateAvailabilitySchema),
  AvailabilityController.updateAvailability,
);

// Update Services
doctorRouter.patch(
  '/services/:id',
  requestValidation(ServiceValidationSchemas.updateServiceValidationSchema),
  auth(UserRole.Doctor),
  ServiceControllers.updateService,
);

// Delete Services
doctorRouter.delete(
  '/services/:id',
  auth(UserRole.Doctor),
  ServiceControllers.deleteService,
);

// Get All Doctor
doctorRouter.get('/', DoctorControllers.retrieveDoctors);

// Get Doctor Profile
doctorRouter.get(
  '/:id',
  auth(UserRole.Doctor, UserRole.Patient, UserRole.Admin),
  DoctorControllers.doctorDetails,
);

// Export Doctor Router
export const DoctorRoutes = doctorRouter;
