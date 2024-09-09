import { DiaryEntry } from "../types";

import Entry from './Entry';

interface DiaryEntryProps {
  diaryEntries: DiaryEntry[]
}

const Diaries = (props: DiaryEntryProps) => {
  return (
    <div>
      <h3>Diary entries</h3>
      {props.diaryEntries.map(d => <Entry {...d} key={d.id}/>)}
    </div>
  );
};

export default Diaries;