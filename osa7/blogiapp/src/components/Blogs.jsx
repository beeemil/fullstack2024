import blogService from '../services/blogs'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
const Blogs = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })
  if ( result.isLoading ) {
    return <div>Loading data...</div>
  }
  if ( result.isError ) {
    <div>Blog service not available due to problems in server</div>
  }
  const blogs = result.data
  return (
    <div>
      <h3>Blogs</h3>
      <Table striped>
        <tbody>
          <tr>
            <th>Blog</th>
            <th>Added by</th>
          </tr>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </td>
                <td>
                  {blog.user.name}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  )
}
export default Blogs