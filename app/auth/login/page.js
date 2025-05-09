'use client'

import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

function Login() {
    const client = useSession()
    const router = useRouter()

    useEffect(() => {
        if (client.status === "authenticated") {
            router.push("/")
        }
    }, [client.status])

    return (
        <div class="text-[#333] z-50">
            <div class="h-[80vh] flex flex-col items-center justify-center">
                <div class="items-center bg shadow gap-4 max-w-[480px] w-[90%] p-4 m-4 rounded-md">
                    <div class="md:max-w-md sm:px-6 py-4">
                        <form>
                            <div className="flex flex-col gap-2 items-center justify-center">
                                <img src="/favicon.ico" className="h-10" />
                                <h2 className="ter-head mb-3">Welcome to <span className="col-pri">The SToller</span></h2>
                            </div>
                            <p class="mb-5 sec-para text-center">Continue with</p>
                            <div class="space-x-8 flex justify-center">
                                <button type="button" class="p-2 border-sec rounded items-center flex-grow flex justify-center outline-none" onClick={() => signIn("google", {

                                })}>
                                    <FcGoogle size={20} />
                                    <span className="border-l pl-3 ml-3 border-l-[#3f3f3f] para">Google</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function KnockLogin() {
    return <Suspense>
        <Login />
    </Suspense>
}