import diagnoseData from '../data/diagnoses';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => {
  return diagnoseData;
};

const findByCode = (code: string) : Diagnosis | undefined => {
  const diagnose = diagnoseData.find(d => d.code === code);
  return diagnose;
};

export default {
  getEntries,
  findByCode
};