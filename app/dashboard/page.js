"use client"

import { useState } from "react";
import InputSection from "../components/InputSection";
import AIGeneratedText from "../components/AIGeneratedText";
import UserGeneratedText from "../components/UserGeneratedText";
import { server, Spinner } from "../components/common";
import useOption from "../components/useOption";

export default function Home() {
    const [chats, setChats] = useState([])
    // const [chats, setChats] = useOption("__mss", [])
    const [waiting, setWaiting] = useState(false)

    async function handelOnUpload(event) {
        event.preventDefault()

        if (waiting) return
        let prompt = event.target.__input__prompt.value

        let sectionCompo = document.querySelector(".__input__prompt")
        if (sectionCompo) {
            sectionCompo.value = ""
        }

        setChats(prev => ([
            ...prev, {
                id: new Date().getTime(),
                message: prompt,
                token_len: prompt?.length || 0,
                coll: [],
                from: "user"
            }
        ]))


        fetchStory(prompt)
        setWaiting(true)
    }

    async function fetchStory(prompt) {
        let response = await server.POST("/v1/lama/generate/story", {
            "prompt": prompt
        })

        if (response === null) {
            setChats(prev => ([
                ...prev, {
                    id: new Date().getTime(),
                    error: true
                }
            ]))

        } else {
            setChats(prev => ([
                ...prev, {
                    id: new Date().getTime(),
                    message: response?.result,
                    coll: response?.coll,
                    token_len: response?.token_len,
                    imgs: [],
                    from: "ai"
                }
            ]))
        }

        setWaiting(false)
    }

    return <>
        <section className="__chat_section overflow-y-scroll">
            <div className="max-w-[900px] w-[90%] mx-auto flex flex-col gap-2 py-5">
                {chats.map((item, index) => {
                    if (item.from === "user") {
                        return <UserGeneratedText item={item} />
                    } else if (item.from === "ai") {
                        return <AIGeneratedText item={item} last={index === (chats.length - 1)} />
                    } else {
                        return <div class="__user_gen w-full flex mt-3">
                            <div class="max-w-[600px] bg-red-500 text-white rounded-lg w-fit p-2 font-medium px-3">
                                Failed to generate response!
                            </div>
                        </div>
                    }
                })}

                {waiting && <div className="fc gap-3" id="__spinner__target_here">
                    {Spinner({ height: "20px" })}
                    <span>Generating...</span>
                </div>}

                <div className="my-5" />
            </div>

            {!chats.length && (
                <div className="mt-[150px] fc text-center px-4 flex-col">
                    <div className="mb-5 max-w-[800px]">
                        <div className="w-full fcc mb-5">
                            {/* <img src="/favicon.ico" alt="" className="w-[100px]" /> */}
                        </div>
                        <h3 className="pri-head mb-1">
                            Welcome to the <span className="col-pri">Land of SToller</span>.
                        </h3>
                        <p className="text-muted para">
                            Whether it's a sleepy moon who wants to shine brighter, a cat learning to fly, or a forest full of giggling mushrooms — <span className="underline">I'm here to spin a tale just for you.</span>
                        </p>
                    </div>

                    <InputSection onUpload={handelOnUpload} />
                </div>
            )}

        </section>

        {!!chats.length && <div className="fcc flex-col flex-grow">
            <InputSection onUpload={handelOnUpload} />
        </div>}
    </>
}
