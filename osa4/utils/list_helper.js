const lodash = require('lodash')

const mostBlogs = (blogs) => {
    const authors = lodash.countBy(blogs, 'author')
    const maxKey = lodash.max(Object.keys(authors), a => authors[a])

    return {
        author:maxKey,
        blogs:authors[maxKey],
    }
}
const mostLikes = (blogs) => {
    const authors = blogs.reduce((totLikes, blog) => {
        totLikes[blog.author] = (totLikes[blog.author] || 0) + blog.likes
        return totLikes
    }, {})
    const author = lodash.maxBy(Object.keys(authors), (author) => authors[author])
    return {author: author, likes: authors[author]}
}
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => (
    blogs.reduce((sum,blog) => sum + blog.likes, 0)
)

const favoriteBlog = (blogs) => (
    blogs.reduce((favorite, blog) => {
        return (favorite.likes > blog.likes) ? favorite : blog
    }, blogs[0])
)

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }