import Input from './Input'
import PropTypes from 'prop-types'

const BlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleLikesChange,
  title,
  author,
  url,
  likes,
}) => {
  const alias = ['Title', 'Author', 'Url', 'Likes']

  return (
    <div className="formDiv">
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <Input value={title} name={alias[0]} setChange={handleTitleChange} />
        <Input value={author} name={alias[1]} setChange={handleAuthorChange} />
        <Input value={url} name={alias[2]} setChange={handleUrlChange} />
        <Input value={likes} name={alias[3]} setChange={handleLikesChange} />
        <button type="submit" id="create-button">
          Create
        </button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  handleLikesChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
}

export default BlogForm
