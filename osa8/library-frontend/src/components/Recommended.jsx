import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import { useEffect, useState } from 'react'

const Recommended = (props) => {
  const result = useQuery(ALL_BOOKS)
  const user = useQuery(ME)
  const [ booksToShow, setBooksToShow ] = useState([])
  useEffect(() => {
    if (result.data && result.data.allBooks && user.data) {
      const genre = user.data.me.favoriteGenre
      const books = result.data.allBooks
      
      setBooksToShow(books.filter(b => b.genres.includes(genre)))
    }
  }, [])
  
  if (!props.show) {
    return null
  }
  if (result.loading || user.loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h2>Books recommended for you</h2>
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
    </div>
  )
}

export default Recommended
