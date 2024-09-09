import patientData from '../data/patients';
import { Patient, NewPatient, EntryWithoutId } from '../types';
import {v1 as uuid} from 'uuid';

const getEntries = (): Omit<Patient, 'ssn'>[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const findById = (id: string) : Patient | undefined => {
  const patient = patientData.find(p => p.id === id);
  console.log('patient find',patient);
  return patient;
};

const addPatient = ( patient: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...patient
  };
  patientData.push(newPatient);
  return newPatient;
};

const addEntry = ( patient: Patient, entry:EntryWithoutId ) => {
  const newEntry = {
    ...entry,
    id: uuid()
  };
  const patientIndex = patientData.findIndex(p => p.id === patient.id);
  const updatedPatient = {
    ...patient,
    entries: [...patient.entries, newEntry]
  };
  patientData[patientIndex] = updatedPatient;
  return updatedPatient;
};

export default {
  getEntries,
  addPatient,
  findById,
  addEntry
};