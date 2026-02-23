import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full h-fit dynamic-x-padding py-6 flex justify-between">
      <Image src="/rehabAi.svg" height={64} width={226} alt="logo" />

      <div className="flex w-[606px] h-fit gap-9 items-center justify-center py-4 px-12 bg-white/5 backdrop-blur-sm rounded-full">
        {["Home", "Rehab", "About", "Contact"].map((item, id) => (
          <a className='cursor-pointer' key={id}>{item}</a>
        ))}
      </div>

      <div />
    </div>
  )
}

export default Navbar