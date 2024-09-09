import { Gender, NewPatient, HealthCheckRating, EntryWithoutId } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

const DischargeSchema = z.object({
  date: z.string().date(),
  criteria: z.string(),
});

const SickLeaveSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export const NewBaseEntrySchema = z.object({
  date: z.string().date(),
  specialist: z.string(),
  description: z.string(),
  diagnosisCodes: z.array(z.string()).optional()
});

export const NewHospitalEntrySchema = NewBaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: DischargeSchema
});

export const NewOccupationalHealthcareEntrySchema = NewBaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickleave: SickLeaveSchema.optional()
});

export const NewHealthcheckEntrySchema = NewBaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

export const NewEntrySchema = z.union([
  NewHealthcheckEntrySchema,
  NewHospitalEntrySchema,
  NewOccupationalHealthcareEntrySchema
]);

const toNewPatient= (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

const toNewEntry = (object: unknown): EntryWithoutId => {
  return NewEntrySchema.parse(object);
};

export default { toNewPatient, toNewEntry };