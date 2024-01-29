import { useState } from "react";

const App = () => {
  const anecdotes = [
		'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
    'I only start couting, when it start to feel hurt.'
	];

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(
    new Array(9 + 1).join("0").split("").map(parseFloat)
  )

  const getRandomAnecdote = () => {
    setSelected(Math.floor(Math.random() * 9))
  }

  const addVote = () => {
    setVotes((pervState) => {
      const copy = [...pervState]
      copy[selected] += 1;
      return [...copy]
    })
  }

  const highestVote = () => {
    return votes.reduce((current, previous) => {
      if (current >= previous) {
        return current
      } else {
        return previous
      }
    }, 0)
  }

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      {anecdotes[selected]}
      <div>
        <strong>Votes: </strong>
        {votes[selected]}
      </div>
      <div>
        <button onClick={getRandomAnecdote}>Random Anecdote</button>
        <button onClick={addVote}>Vote</button>
      </div>
      {votes.reduce((previous, current) => previous + current, 0) === 0 ? (
        ""
      ) : (
        <div>
          <h2>Anecdotes with most votes</h2> {" "}
          {anecdotes[votes.indexOf(highestVote())]}
        </div>
      )}
    </div>
  )
}

export default App