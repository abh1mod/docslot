import React from 'react'
import Button from './Button'


const TextButton = ({heading,subheading}) => {
  return (
    <div>
      <div className='flex flex-col gap-10 mt-10'>
      <div className='flex flex-col gap-2'>
       {/* heading */}
        <p className='lg:text-4xl text-3xl font-semibold text-[#007E85]'>
          {heading}
        </p>
        {/* subheading */}
        <p className='font-medium text-medium text-gray-600'>
        {subheading}
        </p>
      </div>
      </div>
    </div>
  )
}

export default TextButton