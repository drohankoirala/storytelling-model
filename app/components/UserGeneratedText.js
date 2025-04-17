"use client";

export default function UserGeneratedText({ item }) {
    return <div className="__user_gen w-full flex justify-end my-3">
        <div className="max-w-[600px] px-4 box rounded-lg w-fit p-3">
            {item?.message}
        </div>
    </div>
};