import { useState } from "react"

const Button = ({onSmash, text}) => <button onClick={onSmash}>{text}</button>

const Statistic = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = good / all * 100

  if (all === 0) {
    return <div>
      <p>No feedback given yet</p>
    </div>
  }

  return  (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutral</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>bad</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>all</td>
            <td>{all}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{average.toFixed(1)}</td>
          </tr>
          <tr>
            <td>positive</td>
            <td>{positive.toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Feedback = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  
  const handleBadClick = () => {
    setBad(bad + 1)
  }
  
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button onSmash={handleGoodClick} text='good' />
      <Button onSmash={handleNeutralClick} text='neutral' />
      <Button onSmash={handleBadClick} text='bad' />
      <Statistic good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

function App() {
  return (
    <Feedback />
  )
}

export default App