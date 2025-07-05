import React from 'react'
import { RxVideo } from "react-icons/rx";

const Button = ({text,bg,video}) => {
  return (
    <div className={`${bg?"bg-[#007E85] w-fit p-2 text-white items-center font-medium flex flex-row gap-2 rounded-md":"bg-white w-fit p-2 text-[#007E85] font-medium items-center flex flex-row gap-2 rounded-md border bottom-2 border-[#007E85]"}`}>
      {video?<RxVideo className='text-xl' />:""}
      <button>{text}</button>
    </div>
  )
}

export default Button
