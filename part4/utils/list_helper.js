const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item;
  };

  const blogsLikes = blogs.map((blogs) => blogs.likes);

  return blogsLikes.reduce(reducer, 0);
};

const favoriteBlogs = (blogs) => {
  const blogsLikes = blogs.map((blogs) => blogs.likes);
  const mostLikes = blogsLikes.indexOf(
    Math.max(...blogsLikes)
  );
  const mostInfo = blogs[mostLikes];

  return {
    title: mostInfo.title,
    author: mostInfo.author,
    likes: mostInfo.likes,
  };
};

const mostBlogs = (blogs) => {
  const blogsAuthor = blogs.map((blogs) => blogs.author);

  let mode = _.chain(blogsAuthor)
    .countBy()
    .entries()
    .maxBy(_.last)
    .thru(_.head)
    .value();

  let count = 0;

  blogsAuthor.forEach((blog) => {
    if (blog === mode) {
      count += 1;
    }
  });

  return {
    author: mode,
    blogs: count,
  };
};

const mostLikes = (blogs) => {
  const groupBlogs = _.groupBy(blogs, 'author');
  const countedAuthors = _.map(groupBlogs, (arr) => {
    return {
      author: arr[0].author,
      likes: _.sumBy(arr, 'likes'),
    };
  });

  const mostLikesAuthor = _.maxBy(
    countedAuthors,
    (a) => a.likes
  );
  const authorName = _.head(_.values(mostLikesAuthor));

  return {
    author: authorName,
    likes: mostLikesAuthor.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes,
};
