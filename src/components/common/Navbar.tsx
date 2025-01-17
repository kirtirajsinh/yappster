"use client";

import type React from "react";
// import Image from 'next/image';

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="border-b border-custom-1 w-full absolute top-0 left-0 h-16 flex items-center px-10 z-10 text-slate-100 justify-between">
      {/* <Image
        src="/images/Logo.png"
        alt="logo"
        width={180}
        height={180}
        className="object-contain"
        quality={100}
        priority
      /> */}
      <h1 className="text-2xl font-bold md:text-4xl">Yapster</h1>
    </header>
  );
};
export default Navbar;
