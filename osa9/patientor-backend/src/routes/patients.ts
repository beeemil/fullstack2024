import express from 'express';
import patientService from '../services/patientService';
import { NewPatientSchema, NewEntrySchema } from '../utils';
import { z } from 'zod';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getEntries());
});

router.get('/:id', (req, res) => {
  console.log('req',req);
  const patient = patientService.findById(String(req.params.id));
  console.log('patient',patient);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req,res) => {
  const patient = patientService.findById(String(req.params.id));
  if (patient) {
    const newEntry = NewEntrySchema.parse(req.body);
    const updatedPatient = patientService.addEntry(patient, newEntry);
    if (updatedPatient) {
      res.send(updatedPatient);
    } else {
      res.sendStatus(404);
    }
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});


export default router;