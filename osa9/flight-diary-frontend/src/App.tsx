import { useState, useEffect } from 'react';
import './App.css';
import { DiaryEntry } from './types';
import { getAllDiaries } from './diaryService';
import Diaries from './components/Diaries';
import DiaryForm from './components/DiaryForm';
const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    });
  },[]);
  return (
    <>
      <DiaryForm diaryEntries={diaries} setDiaries={setDiaries}/>
      <Diaries diaryEntries={diaries}/>
    </>
  );
};

export default App;
