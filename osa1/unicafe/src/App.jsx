import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticsLine = (props) => (
  <>
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
      <td>{props.isPercentage ? " %" : ""}</td>
    </tr>
  </>
)

const Statistics = ({good, neutral, bad}) => {
  if (good + bad + neutral === 0) {
    return(
      <>
        <p>No feedback given</p>
      </>
    )
  }
  return (
  <>
  <table>
    <tbody>
      <StatisticsLine text = "good" value = {good}/>
      <StatisticsLine text = "neutral" value = {neutral}/>
      <StatisticsLine text = "bad" value = {bad}/>
      <StatisticsLine text = "all" value = {bad + neutral + good}/>
      <StatisticsLine text = "average" value = {(bad * -1 + good * 1) / (bad + neutral + good)}/>
      <StatisticsLine text = "positive" value = {good / (good + bad + neutral) * 100} isPercentage = {true}/>
    </tbody>
  </table>
  </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>Give feedback</h1>
      <Button handleClick = {() => setGood(good + 1)} text = "good"/>
      <Button handleClick = {() => setNeutral(neutral + 1)} text = "neutral"/>
      <Button handleClick = {() => setBad(bad + 1)} text = "bad"/>
      <h1>Statistics</h1>
      <Statistics good = {good} bad = {bad} neutral = {neutral}/>
    </>
  )
}

export default App