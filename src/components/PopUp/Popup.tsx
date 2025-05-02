import { ReactNode } from "react";

interface popupProps {
    state: boolean,
    children: ReactNode
}

export default function Popup({ state, children }: popupProps) {
    return (
        <section className={state ? "w-screen h-screen flex justify-center items-center py-5 bg-alpha fixed top-0 left-0 overflow-auto z-50" : "hidden"}>
            {children}
        </section>
    );
}