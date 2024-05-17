import React from 'react';
function SmallLoader() {
    return <div className='z-[1000] h-full w-full flex items-center justify-center
        bg-white dark:bg-sidebar-bg'>
            <div className="loader">
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
                <div className="circle bg-black-bg dark:bg-circle-border"></div>
            </div>
        </div>
    ;
}

export default SmallLoader;
