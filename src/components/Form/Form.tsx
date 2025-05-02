import { ReactNode } from "react";

interface formProps {
    title: string;
    text: string;
    onClose: () => void;
    onClick: any;
    children: ReactNode;
}

export default function Form({ title, text, onClose, onClick, children }: formProps) {
    return (
        <div className="w-11/12 max-w-[520px] py-8 bg-white rounded-xl">
            <div className="w-10/12 mx-auto">
                <div className="w-full flex justify-between items-center mx-auto">
                    <h2 className="text-base md:text-xl font-bold capitalize">{title}</h2>

                    <button
                        className="w-9 h-9 border border-gray-200 rounded-md"
                        type="button"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                {children}

                <button
                    className="w-full h-12 mx-auto bg-blue-600 text-base text-white rounded-md mt-5"
                    type="button"
                    onClick={onClick}
                >
                    Salvar
                </button>

                <div className="w-full flex justify-center items-center mt-8">
                    <div className="flex flex-1 border-b border-gray-200" />

                    <div className="text-xs text-gray-500 px-4 capitalize">{text}</div>

                    <div className="flex flex-1 border-b border-gray-200" />
                </div>
            </div>
        </div>
    );
}
