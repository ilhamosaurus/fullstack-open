const BlogDetail = ({ blog }) => {
  return (
    <div>
      <p>{blog.url}</p>
      <p>
        {blog.likes}
        <button>like</button>
      </p>
      <p>{blog.user ? blog.user.name : "No user information available"}</p>
    </div>
  );
};

export default BlogDetail;
