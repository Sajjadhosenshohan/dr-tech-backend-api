import { Types } from 'mongoose';

export type TAppointment = {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  serviceId: Types.ObjectId;
  selectedDate: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
};
export type TPopulatedAppointment = TAppointment & {
  doctorId: { name: string };
  patientId: { name: string; email: string };
  serviceId: { title: string };
};
