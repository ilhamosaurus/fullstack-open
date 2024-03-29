import BlogDetail from './BlogDetail'
import Toggelable from './Toggelable'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLikes, deleteBlogs, userId }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWitdth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="whenHidden">
        {blog.title} {blog.author}
      </div>
      <Toggelable buttonLabel="View" buttonLabel2="Hide">
        <BlogDetail
          blog={blog}
          addLikes={addLikes}
          deleteBlog={deleteBlogs}
          userId={userId}
        />
      </Toggelable>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func.isRequired,
  deleteBlogs: PropTypes.func.isRequired,
}

export default Blog
