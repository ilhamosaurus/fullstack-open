import Input from './Input';

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
  const alias = ['Title', 'Author', 'Url', 'Likes'];

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={title}
          name={alias[0]}
          setChange={handleTitleChange}
        />
        <Input
          value={author}
          name={alias[1]}
          setChange={handleAuthorChange}
        />
        <Input
          value={url}
          name={alias[2]}
          setChange={handleUrlChange}
        />
        <Input
          value={likes}
          name={alias[3]}
          setChange={handleLikesChange}
        />
        <button type='submit'>Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
