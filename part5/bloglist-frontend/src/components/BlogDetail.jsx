import PropTypes from 'prop-types'

const BlogDetail = ({ blog, addLikes, deleteBlog }) => {
  const handleLikes = () => {
    const updatedLikes = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    addLikes(blog.id, updatedLikes)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }
  return (
    <div>
      <p>{blog.url}</p>
      <p>
        {blog.likes}
        <button onClick={handleLikes} className="likeButton">
          like
        </button>
      </p>
      <p>{blog.user ? blog.user.name : 'No user information available'}</p>
      <button onClick={handleDelete}>Remove</button>
    </div>
  )
}

BlogDetail.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default BlogDetail
