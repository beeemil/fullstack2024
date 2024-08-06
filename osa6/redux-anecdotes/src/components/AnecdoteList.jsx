import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if ( filter === '' ){
        return anecdotes
    }
    return anecdotes.filter(a => a.content.toLowerCase().search(filter.toLowerCase()) !== -1)
  })

  return(
    <ul>
      {anecdotes.map(a =>
        <Anecdote
          key={a.id}
          anecdote={a}
          handleClick={() => {
            dispatch(voteAnecdote(a))}
          }
        />
      )}
    </ul>
  )
}

export default Anecdotes