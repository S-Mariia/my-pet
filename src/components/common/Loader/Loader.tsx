import React from 'react';
import {useAppSelector} from "@/redux/hooks";

function Loader() {
    const {loading} = useAppSelector((state) => state.loading);
    return loading?(
        <div className='fixed z-[1000] h-[100vh] w-[100vw] flex items-center justify-center
        bg-white dark:bg-[black]'>
            <div className="loader">
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
            </div>
        </div>):(<></>
    );
}


export default Loader;
