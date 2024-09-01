import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import blogService from '../services/blogs'

const User = () => {
  const id = useParams().id
  const result = useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id)
  })
  const blogResult = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })
  console.log('blogresult',blogResult)
  if ( result.isLoading ) {
    return <div>Loading user...</div>
  }
  if ( result.isError ) {
    <div>User service not available due to problems in server</div>
  }
  if ( blogResult.isLoading ) {
    return <div>Loading blogs</div>
  }
  if ( blogResult.isError ) {
    return <div>Error with blogs</div>
  }
  const user = result.data
  const blogs = blogResult.data
  console.log('user',user)
  console.log('blgos',blogs)

  return (
    <div>
      <h1>{user.name}</h1>
      <h3>Added blogs</h3>
      <ul>
        {blogs
          .filter(b => b.user.id === user.id)
          .map(b => (
            <li key={b.id}>{b.title}</li>
          ))}
      </ul>
    </div>
  )
}

export default User