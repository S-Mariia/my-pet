import React, { forwardRef } from 'react';

type SelectOption = {
    label: string;
    value: string;
};

type ControlSelectProps = {
    options: SelectOption[];
    disabled?: boolean;
    errorMessage?: string;
};

const ControlSelect = forwardRef<HTMLSelectElement, ControlSelectProps>(
    ({ options, disabled = false,errorMessage, ...rest }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    disabled={disabled}
                    style={{borderRadius: '14px!important'}}
                    {...rest}
                    className={`${
                        disabled ? 'bg-disabled-input-bg' : 'bg-[white] dark:bg-input-bg-dark'
                    } border border-solid border-input-border dark:border-input-border-dark rounded-input px-[16px] py-[18px] font-NotoSans text-[14px] font-normal text-input-text dark:text-input-text-dark w-full min-h-[59px] h-[59px]`}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {!!errorMessage&& <small className="text-[red] absolute bottom-[-25px] left-0 right-0 text-center">{errorMessage}</small>}
            </div>
        );
    }
);

export default ControlSelect;
