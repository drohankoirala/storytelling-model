"use client"

import Link from "next/link";
import React from "react";
import { TbCategory } from "react-icons/tb";

export default function Navbar({ }) {
    return <>
        <nav className="w-full px-6 py-4 box h-[80px] shadow flex justify-between items-center bg-white border-b border-gray-200">
            <div className="max-w-[1400px] fcb w-full mx-auto">
                <Link href={"/"} className="fc gap-3">
                    <img src="/favicon.ico" alt="" className="w-[40px]" />
                    <h2 className="text-2xl">SToller</h2>
                </Link>
                <div className="fcb gap-5 text-gray-600 font-medium">
                    <a href="#">Dashboard</a>
                    <a href="#">Pricing</a>
                    <a href="#">Docs</a>
                    <a href="#">Developer API</a>
                    <TbCategory size={25} className="ml-3" />
                    <Link class="flex py-[2px] pl-[2px] overflow-hidden gap-2 items-center rounded-3xl border-sec pr-2 transition-all duration-300" href="#">
                        <img src="/favicon.ico" class="w-[30px] h-[30px] p-1 rounded-3xl border-[#b1b1b1]" />
                        <span class="overflow-hidden text-nowrap text-ellipsis">Hi, There</span>
                    </Link>
                </div>
            </div>
        </nav>
    </>
}