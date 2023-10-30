import Image from 'next/image'

import React from 'react'

const Hero = () => {
  return (
    <div className='hero'>
      <div className='flex-1 pt-36 padding-x'>
        <h1 className='hero__title'>
          Temukan, pesan, atau sewa mobil - dengan cepat dan mudah!
        </h1>
        <p className='hero__subtitle'>
        Sederhanakan pengalaman sewa mobil Anda dengan proses pemesanan kami yang mudah.
        </p>
      </div>
    </div>
  )
}

export default Hero