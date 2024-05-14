import { useState } from 'react'


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const handleVote = (selected) => {
    const copy = [...votes]
    copy[selected] += 1
    const getMaxIndex = (arr) => arr.reduce((maxIndex, current, index, array) => current > array[maxIndex] ? index : maxIndex, 0); // netistä löytynyt
    setVotes(copy)
    setMostVoted(getMaxIndex(copy))
}

  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
  

  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br/>
      <p>has {votes[selected]} votes</p>
      <br/>
      <Button text = 'Vote' handleClick = {() => handleVote(selected)}/>
      <Button text = 'Next Anecdote' handleClick = {() => setSelected(Math.floor(Math.random()*anecdotes.length))}/>
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVoted]}
      <br/>
      <p>has {votes[mostVoted]} votes</p>
    </div>
  )
}

export default App