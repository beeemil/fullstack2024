import diagnoseService from "../../services/diagnoses";
import { useEffect, useState } from "react";

interface Props2 {
  code: string;
}

const Diagnose = ( diagnose : Props2 ) => {
  const [ diagnoseName, setDiagnoseName ] = useState('');
  useEffect(() => {
    if (!diagnose.code || typeof(diagnose.code) !== 'string') {
      console.error('ID must be provided!');
    }
    diagnoseService
      .getByCode(String(diagnose.code))
      .then(data => {
        setDiagnoseName(data.name);
      });
  },[diagnose.code]);
  return (
    <>
      <li><i>{diagnoseName}</i></li>
    </>
  );
};

export default Diagnose;