"use client";

import React, { useEffect, useState } from "react";
import cn from "../utils/cn";
import { useChainStore } from "./store/chainStore";

interface Mode{
  mode: number
}

const ModeIndicator = () => {
  const modeArr = ["swap", "pay", "onramp", "done"];
  // const [mode, setMode] = React.useState(modeArr[0]);
  const mode: Mode = useChainStore() as Mode;

  useEffect(() => {
    console.log(`Mode: ${JSON.stringify(mode)}`);
  }, [mode]);

  return (
    <div className="flex flex-row justify-evenly items-center p-5 h-15% w-full">
        <div className="flex flex-col items-center gap-1"> 
            <div
              className={cn(
                mode?.mode === 0 ? "bg-[#39A7FF] text-white" : "bg-white text-black",
                "w-[50px] h-[50px]  border-[2px] border-[#39A7FF] rounded-full flex items-center justify-center"
              )}
            >
              1
            </div>
            <div>Swap</div>
        </div>

        <div className="flex flex-col items-center gap-1"> 
            <div
              className={cn(
                mode?.mode === 1 ? "bg-[#39A7FF] text-white" : "bg-white text-black",
                "w-[50px] h-[50px]  border-[2px] border-[#39A7FF] rounded-full flex items-center justify-center"
              )}
            >
              2
            </div>
            <div>Pay</div>
        </div>

        <div className="flex flex-col items-center gap-1"> 
            <div
              className={cn(
                mode?.mode === 2 ? "bg-[#39A7FF] text-white" : "bg-white text-black",
                "w-[50px] h-[50px]  border-[2px] border-[#39A7FF] rounded-full flex items-center justify-center"
              )}
            >
              3
            </div>
            <div>On-ramp</div>
        </div>

        <div className="flex flex-col items-center gap-1"> 
            <div
              className={cn(
                mode?.mode === 3 ? "bg-[#39A7FF] text-white" : "bg-white text-black",
                "w-[50px] h-[50px]  border-[2px] border-[#39A7FF] rounded-full flex items-center justify-center"
              )}
            >
              4
            </div>
            <div>Dome</div>
        </div>

    </div>
  );
};

export default ModeIndicator;
