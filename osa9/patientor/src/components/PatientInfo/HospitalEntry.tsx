import { HospitalEntry as HospitalEntryType } from "../../types";
import { Box } from '@mui/material';
import Diagnose from "./Diagnose";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
interface Props {
  entry: HospitalEntryType
}

const HospitalEntry = ({entry} : Props) => {
  return (
    <Box component="section" sx={{p: 2, width: 1/3, border: '2px solid black', margin:2}}>
      <div>
        {entry.date} <LocalHospitalIcon/> <br/>
        <i>{entry.description}</i><br/>
        {entry.diagnosisCodes?.map(d => <Diagnose key={d} code={d}/>)}
        diagnose by {entry.specialist} <br/>
        discharge {entry.discharge.criteria} {entry.discharge.date}
      </div>
    </Box>
  );
};

export default HospitalEntry;