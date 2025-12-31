import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className='main-container inner'>
        <Link href='/'>
        <Image src="/assets/logo.svg" alt='logo' width={132} height={40} />
        </Link>
    </header>
  )
}

export default Header