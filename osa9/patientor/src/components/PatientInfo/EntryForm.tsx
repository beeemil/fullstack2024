import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Grid,
  FormControl, Radio, FormLabel, FormControlLabel, RadioGroup, 
  SelectChangeEvent,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem} from '@mui/material';
import patientService from '../../services/patients';
import diagnoseService from '../../services/diagnoses';
import { HealthCheckRating, EntryWithoutId, Diagnosis, Patient } from '../../types';
import ErrorBox from './ErrorBox';

const getInitialFormValues = (entryType: EntryWithoutId['type']): EntryWithoutId => {
  switch (entryType) {
    case 'HealthCheck':
      return {
        type: 'HealthCheck',
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [] as string[],
        healthCheckRating: HealthCheckRating.Healthy
      };
    case 'Hospital':
      return {
        type: 'Hospital',
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [] as string[],
        discharge: { date: '', criteria: '' }
      };
    case 'OccupationalHealthcare':
      return {
        type: 'OccupationalHealthcare',
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [] as string[],
        employerName: '',
        sickLeave: { startDate: '', endDate: '' }
      };
    default:
      throw new Error(`Unhandled entry type: ${entryType}`);
  }
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};
interface Props {
  patient: Patient,
  setPatient: (patient: Patient) => void;
}

const EntryForm = ( {patient, setPatient}: Props ) => {
  const [ type, setType ] = useState<EntryWithoutId["type"]>('HealthCheck');
  const [formValues, setFormValues] = useState<EntryWithoutId>(getInitialFormValues(type));
  const [ diagnoses, setDiagnoses ] = useState<Diagnosis[]>([]);
  const [ show, setShow ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');
  // const [ selectedDiagnoses, setSelectedDiagnoses ] = useState<string[]>([]);

  useEffect(() => {
    diagnoseService.getAll()
    .then(data => {
      setDiagnoses(data);
    }).catch(error => {
      console.log('error',error);
    });
  }, []);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    if (name === 'healthCheckRating' && formValues.type === "HealthCheck") {
      setFormValues({
        ...formValues,
        healthCheckRating: Number(value),
      });
    } else if (formValues.type === 'OccupationalHealthcare' && name.startsWith('sickLeave')) {
      const updatedSickLeave = {
        startDate: formValues.sickLeave?.startDate || '',
        endDate: formValues.sickLeave?.endDate || '',
        [name.split('.')[1]]: value,  // Dynamically update the specific field
      } as { startDate: string; endDate: string };  // Explicitly type-cast
  
      setFormValues({
        ...formValues,
        sickLeave: updatedSickLeave,
      });
    } else if (formValues.type === 'Hospital' && name.startsWith('discharge')) {
      const updatedDischarge = {
        criteria: formValues.discharge.criteria || '',
        date: formValues.discharge.date || '',
        [name.split('.')[1]]: value
      } as { criteria: string; date: string};
      setFormValues({
        ...formValues,
        discharge: updatedDischarge
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };
  
  
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as EntryWithoutId['type'];
    setType(newType);
    setFormValues(getInitialFormValues(newType)); // Reset form values based on new type
  };

  const handleDiagnoseChange = (event: SelectChangeEvent<string[]>) => {
    setFormValues({
      ...formValues,
      diagnosisCodes: event.target.value as string[]//typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
    });
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    patientService.createEntry(formValues, patient.id).then(data => {
      setPatient(data);
    }).catch(error => {
      console.log('error',error);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage('');
      },3000);
    });
  };
  return (
    <Box>
      {errorMessage === '' ? '' : <ErrorBox errorMessage={errorMessage}/>}
      {show ? 
      <Box component="form" onSubmit={handleSubmit} sx={{ border: '1px dotted black', padding: 2, marginTop: 2 }}>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Entry Type</FormLabel>
            <RadioGroup
              name="type"
              value={formValues.type}
              onChange={handleTypeChange}
              row
            >
              <FormControlLabel value="HealthCheck" control={<Radio />} label="Health Check" />
              <FormControlLabel value="Hospital" control={<Radio />} label="Hospital" />
              <FormControlLabel value="OccupationalHealthcare" control={<Radio />} label="Occupational Healthcare" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Typography variant="h6">New {formValues.type} entry</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formValues.date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Specialist"
              name="specialist"
              value={formValues.specialist}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          {formValues.type === 'HealthCheck' ?
          <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Healthcheck Rating</FormLabel>
                <RadioGroup
                  name="healthCheckRating"
                  value={formValues.healthCheckRating}
                  onChange={handleInputChange}
                  row
                >
                  {Object.values(HealthCheckRating)
                    .filter(value => typeof value === 'number') // Filter to ensure only numeric values are used
                    .map(value => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio />}
                        label={HealthCheckRating[value as HealthCheckRating]} // Use enum reverse mapping to get label
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </Grid> : ''}
            {formValues.type === "OccupationalHealthcare" ? 
            <>
              <Grid item xs={12}>
              <TextField
                label="Employer"
                name="employerName"
                value={formValues.employerName}
                onChange={handleInputChange}
                fullWidth
              />
              </Grid>
                Sick leave
                <Grid item xs={12}> 
                <TextField
                  label="Start date"
                  name="sickLeave.startDate"
                  type="date"
                  value={formValues.sickLeave?.startDate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </Grid>
                <Grid item xs={12}> 
                <TextField
                  label="End date"
                  name="sickLeave.endDate"
                  type="date"
                  value={formValues.sickLeave?.endDate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </Grid>
          </> : ''}
          {formValues.type === "Hospital" ? 
            <>
            Discharge:
            <Grid item xs={12}>
            <TextField
              label="Discharge criteria"
              name="discharge.criteria"
              value={formValues.discharge.criteria}
              onChange={handleInputChange}
              fullWidth
            />
            </Grid>
            <Grid item xs={12}> 
              <Grid item xs={12}> 
              <TextField
                label="Discharge date"
                name="discharge.date"
                type="date"
                value={formValues.discharge.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
              </Grid>
            </Grid>
        </> : ''}
          <Grid item xs={12}>
            <FormControl sx={{m:1,width:300}}>
            <InputLabel id = "multiple-diagnose-label">Diagnose code</InputLabel>
            <Select
              labelId="multiple-diagnose-label"
              multiple
              value={formValues.diagnosisCodes}
              onChange={handleDiagnoseChange}
              input={<OutlinedInput label = "Diagnose code"/>}
              MenuProps={MenuProps}
              >
                {diagnoses.map((d) => (
                  <MenuItem
                    key={d.code}
                    value={d.code}
                  >
                    {d.code} {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {show ? <Button variant="contained" color="primary" type="submit">Add</Button> : ''}
        </Box>
        : '' }
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" color={show ? "error" : "primary"} onClick={() => setShow(!show)}>{show ? "Cancel" : "New entry"}</Button>
          
        
      </Box>

      {/* Display the list of entries */}
      <Typography variant="h6" sx={{ marginTop: 2 }}>Entries</Typography>
      {/* Render the entries */}
    </Box>
  );
};

export default EntryForm;
