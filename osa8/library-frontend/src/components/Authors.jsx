import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR  } from "../queries"
import { useState } from 'react'
import Select from 'react-select'

const Authors = (props) => {
  const [ name, setName ] = useState(null)
  const [ birthyear, setBirthyear ] = useState('')
  const [ addBirthYear ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      console.log('error', messages)
    }
  })
  const result = useQuery(ALL_AUTHORS)
  const submit = async (event) => {
    event.preventDefault()
    const setBornTo = parseInt(birthyear)
    addBirthYear({ variables: { name: name.value, setBornTo } } )
    setName(null)
    setBirthyear('')
  }
  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>Loading...</div>
  }
  console.log('resultdata',result)
  const authors = result.data.allAuthors
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token ? 
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit = {submit}>
            <div>
              <Select
                defaultValue = {name}
                onChange = {setName}
                options = {authors.map(a => ({ value: a.name, label: a.name }))}/>
            </div>
            <div>
              born
              <input
                value = {birthyear}
                onChange={({ target }) => setBirthyear(target.value)}/>
            </div>
            <button type="submit">update author</button>
          </form>
        </div> 
      : ''}
    </div>
  )
}

export default Authors
