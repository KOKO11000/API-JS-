import React from 'react'
import { useNavigate } from 'react-router'
import Menu from '../components/home/Menu'

export default function Aircrafts() {
    //  const navigate = useNavigate()
    // if (!token) {
    //     return navigate('/')
    // }
  return (
    <div>
      <Menu />
      <h1 className='text-center text-4xl font-bold mt-10'>Aircrafts Page</h1>  
      
    </div>
  )
}
