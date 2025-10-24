import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null) 
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      setErrorMessage(
        `Wrong username or password`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
  }

  const Notification = ({ notificationMessage }) => {
  if (notificationMessage === null) {
    return null
  }
  return (
    <div className="notificationMessage">
      {notificationMessage}
    </div>
  )
}

const Alert = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }
  return (
    <div className="errorMessage">
      {errorMessage}
    </div>
  )
}

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
      </div>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <h2>add new blog</h2>
        <form onSubmit = {addBlog}>
          <div>
            <label>
              title:
              <input
                type="text"
                value={title}
                name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
            </label>
          </div>
          <div>
            <label>
            author:
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
            </label>
          </div>
          <div>
            <label>
              url:
              <input
                type="text"
                value={url}
                name="Url"
                onChange={({ target }) => setUrl(target.value)}
              />
            </label>
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    )
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotificationMessage(
        `A new blog '${title}' by ${author} added`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
        setErrorMessage(
          `Remember to fill all the fields`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Alert errorMessage ={errorMessage} />
      <Notification notificationMessage={notificationMessage} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          <div style={{marginTop: '20px'}}>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App