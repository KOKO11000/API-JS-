import React from 'react'

export default function Menu() {
  return (
    <div>
        <menu className='flex gap-5 justify-center mt-5 border-b-2 pb-5 text-3xl font-bold'>
            <li><a href="/">Home</a></li>
            <li><a href="/aircrafts">Aircrafts</a></li>
            <li><a href="/aircraft-type">Aircraft Type</a></li>
            <li><a href="/flights">Flights</a></li>
        </menu>
    </div>
  )
}
