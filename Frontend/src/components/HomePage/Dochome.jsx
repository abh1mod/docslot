import React from 'react'

const Dochome = ({logo,heading,subheading}) => {
    const Icon = logo;
  return (
    <div className='flex flex-col gap-4 p-7'>
    <div className='flex flex-row gap-2 items-center'>
       <Icon className="text-4xl"/>
       <p className='text-2xl font-semibold'>
        {heading}
       </p>
    </div>
       <p className='font-medium text-medium text-gray-500 w-[80%]'>
          {subheading}
       </p>
    </div>
  )
}

export default Dochome