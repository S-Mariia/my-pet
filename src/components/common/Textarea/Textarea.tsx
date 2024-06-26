'use client';

import React, { forwardRef } from 'react';

type TextareaProps = {
    placeholder: string;
    disabled?: boolean;
    errorMessage?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
                                                                     placeholder,
                                                                     disabled = false,
                                                                     errorMessage,
                                                                     ...rest
                                                                 }, ref) => {
    return (
        <div className="relative">
            <textarea
                ref={ref}
                placeholder={placeholder}
                disabled={disabled}
                {...rest}
                className={`${disabled ? 'bg-disabled-input-bg' : 'bg-[white] dark:bg-input-bg-dark'} border border-solid border-input-border dark:border-input-border-dark rounded-input px-[16px] py-[18px] font-NotoSans text-[14px] font-normal text-input-text dark:text-input-text-dark w-full `}
            />
            {!!errorMessage && <small className="text-[red] absolute bottom-[-25px] left-0 right-0 text-center">{errorMessage}</small>}
        </div>
    );
});

export default Textarea;
