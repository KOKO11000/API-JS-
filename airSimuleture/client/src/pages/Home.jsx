import React from 'react'
import { useNavigate } from 'react-router'
import Menu from '../components/home/Menu'

export default function Home() {
   
  return (
    <div className="">
     <Menu />
     <h1 className='text-3xl font-bold text-center mt-10'>Welcome to Air Simulateur</h1>
     <p className='text-center mt-5'>Explore the world of aviation with our flight simulation platform. Experience the thrill of flying and discover the beauty of the skies.</p>

    </div>
  )
}
