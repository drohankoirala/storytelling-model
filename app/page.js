"use client"

import { useState } from "react";
import InputSection from "./components/InputSection";
import AIGeneratedText from "./components/AIGeneratedText";
import UserGeneratedText from "./components/UserGeneratedText";
import { server, Spinner } from "./components/common";

export default function Home() {
    const [chats, setChats] = useState([])
    const [waiting, setWaiting] = useState(false)

    async function handelOnUpload(event) {
        event.preventDefault()

        if (waiting) return
        let prompt = event.target.__input__prompt.value

        event.target.__input__prompt.value = ""

        setChats(prev => ([
            ...prev, {
                id: new Date().getTime(),
                message: prompt,
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

        setChats(prev => ([
            ...prev, {
                id: new Date().getTime(),
                message: response?.response,
                from: "ai"
            }
        ]))

        setWaiting(false)
    }

    return <>
        <section className="__chat_section overflow-y-scroll">
            <div className="max-w-[900px] w-[90%] mx-auto flex flex-col gap-2 py-5">
                {chats.map((item) => {
                    if (item.from === "user") {
                        return <UserGeneratedText item={item} />
                    } else if (item.from === "ai") {
                        return <AIGeneratedText item={item} />
                    }
                })}

                <div className="my-3" />

                {waiting && <div className="fc gap-3">
                    {Spinner({ height: "20px" })}
                    <span>Generating...</span>
                </div>}
            </div>
            {!chats.length && (
                <div className="mt-[150px] fc text-center px-4 flex-col">
                    <div className="mb-5 max-w-[800px]">
                        <div className="w-full fcc mb-5">
                            {/* <img src="/favicon.ico" alt="" className="w-[100px]" /> */}
                        </div>
                        <h3 className="pri-head mb-1">
                            Welcome to the <span className="col-pri">Land of S-Toller</span>.
                        </h3>
                        <p className="text-muted para">
                            Whether it's a sleepy moon who wants to shine brighter, a cat learning to fly, or a forest full of giggling mushrooms — <span className="underline">I'm here to spin a tale just for you.</span>
                        </p>
                    </div>

                    <InputSection onUpload={handelOnUpload} />
                </div>
            )}

        </section>

        {!!chats.length && <div className="h-[125px] fcc flex-col">
            <InputSection onUpload={handelOnUpload} />
        </div>}
    </>
}
