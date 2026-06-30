import { useNavigate } from 'react-router-dom'
import './register.css'
import { useState } from 'react'

function Register () {
  const navigate = useNavigate()
  const [regData, setRegData] = useState({
    username: '',
    password: '',
    role_code: ''
  })
  const [statusMessage, setStatusMessage] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(regData)
      })

      const result = await response.json()

      if (!response.ok) {
        setStatusMessage(result.message || 'Registration failed.')
        return
      }

      localStorage.removeItem('emr_token')
      localStorage.setItem('emr_user', JSON.stringify(result.user))
      setStatusMessage('Registration successful.')
      setRegData({ username: '', password: '', role_code: '' })
      navigate('/')
    } catch (error) {
      setStatusMessage('Unable to reach backend server.')
      console.error(error)
    }
  }

  return (
    <div id='register_page'>
      <h1 id='registerHeader'>Register Page</h1>
      <form id='register_form' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username: </label>
          <input
            type='text'
            placeholder='username'
            value={regData.username}
            onChange={(e) =>
              setRegData({ ...regData, username: e.target.value })}
            id='username'
            name='username'
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password: </label>
          <input
            type='password'
            placeholder='password'
            value={regData.password}
            onChange={(e) =>
              setRegData({ ...regData, password: e.target.value })}
            id='password'
            name='password'
            required
          />
        </div>
        <div>
          <label htmlFor='registerPassword'>Role Code: </label>
          <input
            type='password'
            placeholder='role code'
            value={regData.role_code}
            onChange={(e) =>
              setRegData({ ...regData, role_code: e.target.value })}
            id='registerpassword'
            name='role_code'
            required
          />
        </div>

        <button type='submit' id='register_btn'>
          Register
        </button>
        {statusMessage && <p>{statusMessage}</p>}
        <p id='backToLogin'>
          <a href='/login'>Back to Login</a>
        </p>
      </form>
    </div>
  )
}

export default Register
