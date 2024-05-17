import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Control, useController} from 'react-hook-form';
import Image from "next/image";
import lightCalendar from '../../../../public/images/icons/light-calendar.svg';
import darkCalendar from '../../../../public/images/icons/dark-calendar.svg';
import { useAppSelector } from "@/redux/hooks";
import ReactDatePicker from "react-datepicker";

type CalendarProps = {
    name: string;
    // eslint-disable-next-line
    control: Control<any>;
    errorMessage?: string;
    disabled?: boolean;
};

const Calendar = forwardRef<ReactDatePicker, CalendarProps>(({
                                                                 name,
                                                                 control,
                                                                 errorMessage,
                                                                 disabled = false,
                                                             }, ref) => {
    const {
        field: { onChange, value },
    } = useController({ name, control });
    const { theme } = useAppSelector((state) => state.theme);
    const calendar = theme === 'dark' ? darkCalendar : lightCalendar;

    return (
        <div className="relative w-full">
            <DatePicker
                selected={value || null}
                onChange={(date) =>

                    onChange(date)
                }
                dateFormat="dd/MM/yyyy"
                disabled={disabled}
                // Use `ref` as `ReactDatePicker`
                ref={ref as React.Ref<ReactDatePicker>}
                className={`${disabled ? 'bg-disabled-input-bg' : 'bg-[white] dark:bg-input-bg-dark'} w-full cursor-pointer border border-solid border-input-border dark:border-input-border-dark rounded-input px-[16px] py-[18px] font-NotoSans text-[14px] font-normal text-input-text dark:text-input-text-dark w-full`}
            />
            <Image src={calendar} alt="add new" width={35} height={35} className='pointer-events-none absolute right-[12px] top-[12px] '/>
            {!!errorMessage && <small className="text-[red] absolute bottom-[-25px] left-0 right-0 text-center">{errorMessage}</small>}
        </div>
    );
});

export default Calendar;
