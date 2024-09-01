import userService from '../services/users'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })
  if ( result.isLoading ) {
    return <div>Loading data...</div>
  }
  if ( result.isError ) {
    <div>User service not available due to problems in server</div>
  }
  const users = result.data
  return (
    <div>
      <h3>Users</h3>
      <Table striped>
        <tbody>
          <th>User</th>
          <th>Blogs Created</th>
          {users
            .sort((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}
export default Users