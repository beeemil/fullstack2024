import { NewDiaryEntry, Visibility, Weather, DiaryEntry } from "../types";
import { useState } from "react";
import { createDiary } from "../diaryService";
import Error from "./Error";

interface DiaryEntryProps {
  diaryEntries: DiaryEntry[],
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}

const DiaryForm = (props: DiaryEntryProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Cloudy);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleWeatherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeather(event.target.value as Weather);
  };

  const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisibility(event.target.value as Visibility);
  };

  const createEntry = (event: React.FormEvent) => {
    event.preventDefault();
    const newDiaryEntry: NewDiaryEntry = {
      date: date,
      weather: weather as Weather,
      visibility: visibility as Visibility,
      comment: comment
    };
    createDiary(newDiaryEntry).then(response => {
      console.log('respons',response);
      const diaryEntries = props.diaryEntries;
      console.log('diaryentries', diaryEntries);
      props.setDiaries(diaryEntries.concat(response));
      setDate('');
      setComment('');
    }).catch(error => {
      console.log('error',error.response.data);
      setErrorMessage(error.response.data);
      setTimeout(() => {
        setErrorMessage('');
      },3000);
    });};

  console.log('object values weather',Object.values(Weather));
  return (
    <div>
      <h1>Create new diary entry</h1>
      <Error message={errorMessage}/>
      <form onSubmit={createEntry}>
        <div>
          Date: 
          <input type = "date" onChange={({ target }) => setDate(target.value)}></input>
        </div>
        <div>
          Weather: 
          {Object.values(Weather).map(a => (
            <div key = {a}>
              <input type="radio" key={a} value={a} onChange={() => handleWeatherChange}/>
              <label htmlFor={a}>{a}</label>
            </div>
            ))}
        </div>
        <div>
          Visibility: 
          {Object.values(Visibility).map(a => (
            <div key = {a}>
              <input type="radio" key={a} value={a} onChange={() => handleVisibilityChange}/>
              <label htmlFor={a}>{a}</label>
            </div>
            ))}
        </div>
        <div>
          Comment:
          <input onChange={({ target }) => setComment(target.value)}></input>
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default DiaryForm;