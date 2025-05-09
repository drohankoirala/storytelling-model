"use client";

import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { CiImageOn, CiShare1 } from "react-icons/ci";
import { useEffect, useState } from "react";
import { server } from "./common";
const marked = require('marked');

export default function AIGeneratedText({ item }) {
    let all_text = item?.message?.split("\n") || [item]
    const [image, setImage] = useState({})
    let __this_index = 0

    async function handelConvertForThisImage(index) {
        let response = await server.POST("/v1/gen/generate/image", {
            prompt: item?.coll[index]
        }, true)

        if (response) {
            setImage(prev => ({ ...prev, [index]: (URL.createObjectURL(response) || "failed") }))
        }
    }

    useEffect(() => {
        let needed = all_text.filter(a => a?.includes("<--img--/>"))

        needed.map((item, index) => {
            if (!item?.includes("<--img--/>") || image?.[String(index)]) return

            handelConvertForThisImage(index)
        })
    }, [all_text?.length, item])

    async function handelReRendering(thisImg, index) {
        console.log(thisImg, index);
    }

    return <div className="__ai_gen w-full mt-3">
        <div className="__drk__content max-w-[1000px] px-4 rounded-lg w-fit p-3 pb-1">
            {all_text?.map((item) => {
                let index = String(__this_index)

                if (item?.includes("<--img--/>")) {
                    __this_index += 1
                }

                if (!item) return

                return <>
                    {(!item?.includes("<--img--/>") && item !== "failed") && <div className="__cont__par_txt_" dangerouslySetInnerHTML={{ __html: marked.parse(item) }} />}

                    {(!item?.includes("<--img--/>") && item === "failed") && <div className="__cont__par_col_failed">

                    </div>}

                    {item?.includes("<--img--/>") && <div className="__cont__par_col_ w-full overflow-hidden">
                        {image?.[index] ? <>
                            <img src={image?.[index]} className="w-fit animate-scale-up-down mx-auto" onError={event => handelReRendering(event, index)} />
                        </> : <div className="__loader h-[250px] relative fcc border rounded-md">
                            <CiImageOn className="w-full h-full absolute opacity-5" />
                            <svg className="animate-spin" style={{
                                height: "30px",
                            }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke={"currentColor"} strokeWidth="2" strokeDasharray="15" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>}
                    </div>}
                </>
            })}
        </div>
        <style>{`.__cont__par_txt_ *{all:revert;}`}</style>
        <div className="__options fc ml-3 gap-1">
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