import BlogDetail from './BlogDetail';
import Toggelable from './Toggelable';

const Blog = ({ blog, addLikes, deleteBlogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWitdth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <Toggelable buttonLabel='View' buttonLabel2='Hide'>
        <BlogDetail
          blog={blog}
          addLikes={addLikes}
          deleteBlog={deleteBlogs}
        />
      </Toggelable>
    </div>
  );
};

export default Blog;
