import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GENRE_BOOKS } from '../queries'
import { useEffect, useState } from 'react'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [ booksToShow, setBooksToShow ] = useState([])
  const [ genre, setGenre ] = useState('')
  const { loading, error, data } = useQuery(GENRE_BOOKS, {
    variables: { genre: genre },
  })
  useEffect(() => {
    if (data && data.allBooks) {
      setBooksToShow(data.allBooks) // Set initial state to all books when data is loaded
    }
  }, [data])
  if (!props.show) {
    return null
  }
  if (loading) {
    return <div>Loading...</div>
  }
  const books = result.data.allBooks
  
  const genres = [...new Set(books.map(b => b.genres).flat(1))]
  const handlefilter = (g) => {
    setGenre(g)
  }
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(g => (
        <button key = {g} onClick={() => handlefilter(g)}>{g}</button>
      ))}
      <button onClick={() => setBooksToShow(books)}>all genres</button>
    </div>
  )
}

export default Books
