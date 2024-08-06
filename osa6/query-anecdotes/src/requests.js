import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'
export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async newAnecdote => {
//   try {
    const resp = await axios.post(baseUrl, newAnecdote)
    return resp.data
//   } catch (error) {
//     console.log('errior',error)
//     return error
//   }
}

export const updateAnecdote = updatedAnecdote => {
  axios.put(`${baseUrl}/${updatedAnecdote.id}`,updatedAnecdote).then(res => res.data)
}