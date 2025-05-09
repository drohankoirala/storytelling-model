"use client";

import { RxUpload } from "react-icons/rx";
import InputBox from "./InputBox";

export default function InputSection({ onUpload }) {
    return <>
        <form className="box shadow max-w-[900px] mx-auto bg-sec rounded-xl w-[90%] p-3 fcb" onSubmit={onUpload}>
            <InputBox />

            <button className="p-2 bg-black text-white rounded-xl" type="submit">
                <RxUpload size={20} />
            </button>
        </form>

        <div class="mt-2 text-center max-w-[700px] mb-5">
            <p class="sec-para">By using our service, you agree to our <a class="underline col-pri" href="https://www.toolstol.com/legal/terms-and-condition">Terms and Conditions</a> and <a class="underline col-pri" href="https://www.toolstol.com/legal/privacy-policy">Privacy Policy</a>. Please review these documents as they outline your rights, responsibilities, and how we handle your personal data.</p>
        </div>
    </>
};