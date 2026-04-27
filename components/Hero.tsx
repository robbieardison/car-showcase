"use client";

import Image from 'next/image'
import { CustomButton } from '.'

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className='hero'>
      <div className='flex-1 pt-36 padding-x'>
        <h1 className='hero__title'>
          Cari mobil yang pas, tanpa drama.
        </h1>
        <p className='hero__subtitle'>
        Tinggal filter sesuai budget, bandingin opsinya, lalu chat sales yang ready bantu.
        </p>
        <CustomButton 
        title="Explore Cars"
        containerStyles="bg-primary-blue text-white rounded-full mt-10"
        btnType="button"
        handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className='hero__image'>
          <Image src="/hero.png" alt="hero" fill className = "object-contain"/>
        </div>
      </div>
    </div>
  )
}

export default Hero