"use client"

import { useEffect, useState } from "react";

interface ResultKey {
    createdAt: string;
    name: string;
    deliveries: Delivery[];
    id: string;
    okrId: string;
}

interface Delivery {
    name: string;
    value: string;
}

interface Item {
    id: string;
    name: string;
    resultKeys: ResultKey[];
    createdAt: string;
}

interface objectiveCardProps {
    item: Item;
    onClick: (resultKeyId: string) => void;
    addResultKey: (item: any) => void;
}

export default function ObjectiveCard({ item, onClick, addResultKey }: objectiveCardProps) {
    const [totProgress, setTotProgress] = useState(0)

    const calculateTotalProgress = (item: Item | undefined): number => {
        if (!item || !item.resultKeys) {
            return 0;
        }

        let totalDifference = 0;

        for (const resultKey of item.resultKeys) {
            const progress = resultKey.deliveries.reduce((sum: number, delivery) => sum + parseInt(delivery.value || '0', 10), 0);
            totalDifference += 100 - Math.min(progress, 100);
        }

        totalDifference = Math.min(totalDifference, 100);

        const totalProgress = 100 - totalDifference;

        useEffect(() => {
            setTotProgress(totalProgress);
        }, [totalProgress]);

        return totalProgress;
    };

    return (
        <article className="w-full max-w-[800px] mx-auto">
            <div className="w-full py-8 bg-white border border-gray-200 rounded-xl">
                <div className="w-11/12 mx-auto">
                    <h2 className="text-base font-bold">{item.name}</h2>

                    <div className="w-full h-4 flex mx-auto mt-3 bg-blue-200 rounded-full relative">
                        <div className="bg-blue-400 rounded-full" style={{ width: `${totProgress}%` }} />

                        <span className="w-full h-4 flex justify-center items-center text-xs text-black font-bold absolute left-0 right-0">
                            {calculateTotalProgress(item)}%
                        </span>
                    </div>

                    <div className="w-full flex justify-center items-center mt-8">
                        <div className="flex flex-1 border-b border-gray-200" />

                        <div className="text-xs text-gray-500 px-4">Resultados-Chave</div>

                        <div className="flex flex-1 border-b border-gray-200" />
                    </div>

                    {item.resultKeys?.map((resultKey) => {
                        const progress = resultKey.deliveries.reduce((sum: any, delivery: Delivery) => sum + parseInt(delivery.value || '0', 10), 0);

                        return (
                            <div key={resultKey.id} className="w-full border-b border-gray-200 last:border-b-0 pb-2.5 mt-8">
                                <div className="w-full">
                                    <h2 className="text-base font-bold">{resultKey.name}</h2>
                                </div>

                                <div className="w-full flex justify-center items-center">
                                    <div className="w-full h-4 flex mx-auto bg-blue-200 rounded-full relative">
                                        <div className="bg-blue-400 rounded-full" style={{ width: `${progress}%` }} />

                                        <span className="w-full h-4 flex justify-center items-center text-xs text-black font-bold absolute left-0 right-0">{progress}%</span>
                                    </div>

                                    <button
                                        className="w-8 min-w-8 h-8 min-h-8 flex justify-center items-center border border-gray-100 rounded-md ml-5"
                                        type="button"
                                        onClick={() => onClick(resultKey.id)}
                                    >
                                        <svg className="w-4 fill-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                                    </button>
                                </div>

                                <div className={resultKey.deliveries.length ? "w-full flex justify-center items-center mt-8" : "hidden"}>
                                    <div className="flex flex-1 border-b border-gray-200" />

                                    <div className="text-xs text-gray-500 px-4">Entregas</div>

                                    <div className="flex flex-1 border-b border-gray-200" />
                                </div>

                                <ul className="w-full mt-5">
                                    {resultKey.deliveries.map((delivery: any, index: any) => (
                                        <li key={index} className="w-full mb-2.5 flex justify-between items-center">
                                            <p className="text-sm text-gray-500">{delivery.name}</p>

                                            <span className="w-12 flex justify-end items-center bg-white text-sm text-gray-500 ml-2">{delivery.value}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>

            <div className="w-full h-12 flex justify-end items-center">
                <button
                    className="h-full flex justify-center items-center text-xs text-blue-500 rounded-md capitalize"
                    type="button"
                    onClick={() => addResultKey(item.id)}
                >
                    <span className="w-5 h-5 flex justify-center items-center text-lg mr-1">
                        <svg className="w-4 fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
                    </span>

                    Adicionar Resutado-Chave
                </button>
            </div>
        </article>
    );
}
