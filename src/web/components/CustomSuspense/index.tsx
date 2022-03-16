import React, {Suspense } from "react";

interface SuspenseInput {
    children: React.ReactNode;
  }

const CustomSuspense: React.FC<SuspenseInput> = ({children}) => {
  return (
    <Suspense fallback={<div className="lazyfallback"><span>Loading...</span></div>}>
        {children}
    </Suspense>
  );
}
export default CustomSuspense;