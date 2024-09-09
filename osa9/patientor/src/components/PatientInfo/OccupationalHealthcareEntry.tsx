import { OccupationalHealthcareEntry as OccupationalHealthcareEntryType} from "../../types";
import { Box } from '@mui/material';
import Diagnose from "./Diagnose";
import WorkIcon from '@mui/icons-material/Work';
interface Props {
  entry: OccupationalHealthcareEntryType
}

const OccupationalHealthcareEntry = ({entry} : Props) => {
  return (
    <Box component="section" sx={{p: 2, width: 1/3, border: '2px solid black', margin:2}}>
        {entry.date} <WorkIcon/> {entry.employerName} <br/>
        <i>{entry.description}</i><br/>
        {entry.diagnosisCodes?.map(d => <Diagnose key={d} code={d}/>)}
        diagnose by {entry.specialist}
    </Box>
  );
};

export default OccupationalHealthcareEntry;