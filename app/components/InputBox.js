import { useState, useRef, useEffect } from "react";

export default function InputBox() {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return <>
        <textarea
            type="text"
            name="__input__prompt"
            required
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="__input__prompt p-2 text-lg resize-none w-full outline-none max-h-[250px] h-[40px] scrollbar-hidden"
            placeholder="Start with story theme, Person Name, Place..."
        />
    </>
}
