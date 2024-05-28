'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTheme } from '@/redux/slices/Theme/themeSlice';
import Image from 'next/image';
import sun from '../../../public/images/icons/sun.svg';
import moon from '../../../public/images/icons/moon.png';

function ThemeSwitcher() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  const toggleTheme = () => {
    const newTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative px-[10px] w-14 h-8 flex items-center shadow-md  rounded-full transition-colors focus:outline-none ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        }`}
      >
        <span
          className={`absolute left-[3px] w-6 h-6 rounded-full transition-transform  ${
            theme === 'dark' ? 'transform translate-x-full' : ''
          }`}
        >
          {theme === 'dark' ? <Image width={24} height={24} src={moon.src} alt="Dark Mode" /> : <Image width={24} height={24} src={sun.src} alt="Light Mode" />}
        </span>
      </button>
    </div>
  );
}

export default ThemeSwitcher;
