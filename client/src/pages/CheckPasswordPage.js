import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from '../redux/userSlice'

const CheckPasswordPage = () => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(state => state.user) // Using the full user from slice

  useEffect(() => {
    if (!user?._id) {
      navigate('/email') // Prevent direct access
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios.post(
        URL,
        {
          userId: user._id,
          password,
        },
        { withCredentials: true }
      )

      toast.success(response.data.message)

      if (response.data.success) {
        dispatch(setToken(response.data.token))
        localStorage.setItem('token', response.data.token)
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          <Avatar
            width={70}
            height={70}
            name={user?.name}
            imageUrl={user?.profile_pic}
          />
          <h2 className='font-semibold text-lg mt-1'>{user?.name}</h2>
        </div>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
          >
            Login
          </button>
        </form>

        <p className='my-3 text-center'>
          <Link to={"/forgot-password"} className='hover:text-primary font-semibold'>
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CheckPasswordPage
