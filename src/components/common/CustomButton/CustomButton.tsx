import React from 'react';
import Image from 'next/image';
import googleLogo from '../../../../public/images/logo/google.svg';

type CustomButtonProps = {
  type: 'submit' | 'reset' | 'button',
  title: string,
  // eslint-disable-next-line
  onClick?: any,
  google?: boolean,
  disabled?: boolean
};
function CustomButton({
  type, onClick, title, disabled = false, google = false,
}:CustomButtonProps) {
  const classList = google ? 'flex justify-center gap-[20] bg-white text-input-text dark:text-input-text-dark dark:bg-input-bg-dark border border-solid border-input-border dark:border-input-border-dark hover:border-btn-blue-bg dark:hover:border-white' : (disabled||title==='Cancel' ? ' bg-input-text text-white' : 'hover:bg-btn-hover bg-btn-blue-bg text-white');
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${classList}  w-full p-[15px] rounded-input text-center text-16px text-500 leading-125% transition duration-300 ease-in-out`}
    >
      {google && (
      <div className="flex gap-[20px]">
        <Image src={googleLogo} alt="google" height={20} width={20} />
        <div className="h-[20px] border border-solid border-input-border dark:border-input-border-dark mr-[20px]" />
      </div>
      ) }
      {title}
    </button>
  );
}

export default CustomButton;
