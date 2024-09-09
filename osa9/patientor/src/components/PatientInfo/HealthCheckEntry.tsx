import { HealthCheckEntry as HealthCheckEntryType} from "../../types";
import { Box } from '@mui/material';
import Diagnose from "./Diagnose";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
interface Props {
  entry: HealthCheckEntryType
}

const HealthCheckEntry = ({entry} : Props) => {
  const color = entry.healthCheckRating === 0 ? 'green' : entry.healthCheckRating === 1 ? 'yellow' : entry.healthCheckRating === 2 ? 'red' : 'black';
  return (
    <Box component="section" sx={{p: 2, width: 1/3, border: '2px solid black', margin:2}}>
      <div>
        {entry.date} <MedicalServicesIcon/> <br/>
        <i>{entry.description}</i>
        <ul>
          {entry.diagnosisCodes?.map(d => <Diagnose key={d} code={d}/>)}
        </ul>
        <FavoriteIcon sx={{color: {color}}}/> <br/>
        diagnose by {entry.specialist}
      </div>
    </Box>
  );
};

export default HealthCheckEntry;