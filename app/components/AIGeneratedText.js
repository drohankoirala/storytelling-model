"use client";

import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { CiShare1 } from "react-icons/ci";

export default function AIGeneratedText({ item }) {
    return <div className="__ai_gen w-full mt-3">
        <div className="max-w-[1000px] px-4 rounded-lg w-fit p-3 pb-1 break-words white-space-break" style={{ whiteSpace: "break-spaces" }}>
            {item?.message}
        </div>
        <div className="__options fc ml-3 gap-1 mt-[2px]">
            <div className="__ic p-1 hover:bg-black hover:text-white rounded-lg cursor-pointer">
                <IoCopyOutline size={20} />
            </div>
            <div className="__ic p-1 hover:bg-black hover:text-white rounded-lg cursor-pointer">
                <AiOutlineLike size={20} />
            </div>
            <div className="__ic p-1 hover:bg-black hover:text-white rounded-lg cursor-pointer">
                <AiOutlineDislike size={20} />
            </div>
            <div className="__ic p-1 hover:bg-black hover:text-white rounded-lg cursor-pointer">
                <CiShare1 size={20} />
            </div>
        </div>
    </div>
};