'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import show from '../../../../public/images/icons/show-password.svg';
import hide from '../../../../public/images/icons/hide-password.svg';

type CustomInputProps = {
  type: string,
  value:string,
  placeholder: string,
  setValue: (v:string)=>void
  disabled?: boolean
};
function CustomInput({
  type, value, placeholder, setValue, disabled=false
}:CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const currentType = type === 'password' && showPassword ? 'text' : type;
  return (
    <div className="relative">
      <input
        type={currentType}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${disabled?'bg-disabled-input-bg':'bg-[white] dark:bg-input-bg-dark'} border border-solid border-input-border dark:border-input-border-dark rounded-input p-[15px] font-NotoSans text-[14px] font-normal text-input-text dark:text-input-text-dark w-full `}
      />
      {type === 'password' && (
      <div onClick={() => setShowPassword(!showPassword)} className="h-[58px] w-[40px] absolute cursor-pointer flex items-center justify-center right-[10px] top-0">
        <Image src={showPassword ? show : hide} height={25} width={25} alt="Show password" />
      </div>
      )}
    </div>
  );
}

export default CustomInput;
