import React, { ReactNode } from 'react';

type MainWrapperProps = {
  children: ReactNode
};

function MainWrapper({ children }:MainWrapperProps) {
  return (
    <div className="max-w-[1440px] mx-[auto] md:p-[40px] p-[30px] h-full overflow-x-hidden">
      {children}
    </div>
  );
}

export default MainWrapper;
