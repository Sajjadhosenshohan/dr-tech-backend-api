import { z } from 'zod';

export const createAppointmentZodSchema = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: 'Doctor ID is required',
    }),
    serviceId: z.string({
      required_error: 'Service ID is required',
    }),
    selectedDate: z.enum(
      [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      {
        required_error: 'Selected date is required',
      },
    ),

    timeSlot: z
      .string({
        required_error: 'Time slot is required',
      })
      .refine((val) => /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/.test(val), {
        message: 'Time slot must be in HH:MM AM/PM format',
      }),
  }),
});

export const AppointmentValidationSchema = {
  createAppointmentZodSchema,
};
