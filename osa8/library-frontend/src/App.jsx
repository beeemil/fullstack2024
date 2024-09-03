import { useEffect, useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Login from "./components/Login"
import { useApolloClient, useSubscription } from "@apollo/client"
import Recommended from "./components/Recommended"
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedObject, typeKey) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = typeKey === 'allBooks' ? item.title : item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ typeKey }) => {
    return {
      typeKey: uniqByTitle(typeKey.concat(addedObject)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook, 'allBooks')
      // const updatedAuthor = { ...addedBook.author, born: null, bookCount: 1 }
      // updateCache(client.chache, { query: ALL_AUTHORS }, updatedAuthor, 'allAuthors')
    }
  })
  useEffect(() => {
    setToken(localStorage.getItem('book-app-user-token'))
  }, [])
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? <button onClick={() => setPage("add")}>add book</button> : ''}
        {token ? <button onClick={() => setPage("recommended")}>recommended</button> : ''}
        {!token ? <button onClick={() => setPage("login")}>log in</button> : ''}
        {token ? <button onClick={logout}>logout</button> : ''}
      </div>

      <Authors show={page === "authors"} token = {token}/>

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === "login"} setToken = {setToken} setPage = {setPage}/>

      <Recommended show={page === "recommended"} />
    </div>
  );
};

export default App;
