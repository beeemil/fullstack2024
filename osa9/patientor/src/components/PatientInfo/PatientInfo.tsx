import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import  patientService from "../../services/patients";
import { Patient } from "../../types";
import PatientEntry from "./PatientEntry";

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryForm from "./EntryForm";

const PatientInfo = () => {
  const [ patient, setPatient ] = useState<Patient>();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    if (!id || typeof(id) !== 'string') {
      console.error('ID must be provided!');
    }
    patientService
      .getById(String(id))
      .then(data => {
        setPatient(data);
      });
  },[id]);

  if (!patient) {
    return (
      <div>
        No patient found!
      </div>
    );
  }
  if (id) {
  return (
    <div>
      <h3>{patient.name} {patient.gender === "male" ? <MaleIcon/> : patient.gender === "female" ? <FemaleIcon/> : <TransgenderIcon/> }</h3>
      ssn: {patient.ssn}<br/>
      occupation: {patient.occupation}
      <EntryForm patient = {patient} setPatient={setPatient} />
      {patient.entries.length > 0 ? <h4>entries</h4> : <p>no entries</p>}
      {patient.entries.map(e => <PatientEntry key={e.id} entry={e}/>)}
    </div>
  );
  }
};

export default PatientInfo;