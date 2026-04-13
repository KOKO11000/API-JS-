import React from 'react'
import { useNavigate } from 'react-router'
import Menu from '../components/home/Menu'

export default function Aircraft_type() {
    //  const navigate = useNavigate()
    // if (!token) {
    //     return navigate('/')
    // }
  return (
    <div>
      <Menu />
      <h1 className='text-3xl font-bold text-center mt-10'>Aircraft Types</h1>
      <p className='text-center mt-5'>Discover the various types of aircraft available in our flight simulation platform. From small private planes to large commercial jets, explore the diversity of aviation and find the perfect aircraft for your flying experience.</p>
    </div>
  )
}
