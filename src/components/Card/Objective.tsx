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
    onDelete: any;
}

export default function ObjectiveCard({ item, onClick, addResultKey, onDelete }: objectiveCardProps) {
    const [totProgress, setTotProgress] = useState(0);
    const [completedInfo, setCompletedInfo] = useState({ completed: 0, total: 0 });

    useEffect(() => {
        const { progress, completed, total } = calculateTotalProgress(item);
        setTotProgress(progress);
        setCompletedInfo({ completed, total });

    }, [item]);

    const calculateTotalProgress = (item: Item | undefined): { progress: number; completed: number; total: number } => {
        if (!item || !item.resultKeys || item.resultKeys.length === 0) {
            return { progress: 0, completed: 0, total: 0 };
        }

        let totalDeliveries = 0;
        let completedDeliveries = 0;

        const resultKeysWithDeliveries = item.resultKeys.filter(rk => rk.deliveries && rk.deliveries.length > 0);

        for (const rk of resultKeysWithDeliveries) {
            for (const delivery of rk.deliveries) {
                const val = parseInt(delivery.value || "0", 10);
                totalDeliveries += 1;

                if (val >= 100) {
                    completedDeliveries += 1;
                }
            }
        }

        const avgProgress = resultKeysWithDeliveries.reduce((acc, rk) => {
            const sum = rk.deliveries.reduce((sum, d) => sum + parseInt(d.value || "0", 10), 0);
            const avg = rk.deliveries.length ? sum / rk.deliveries.length : 0;

            return acc + avg;
        }, 0);

        const progress = resultKeysWithDeliveries.length ? Math.round(avgProgress / resultKeysWithDeliveries.length) : 0;

        return { progress, completed: completedDeliveries, total: totalDeliveries };
    };

    return (
        <article className="w-full max-w-[700px] mx-auto">
            <div className="w-full h-12 flex justify-end items-center">
                <button
                    className="h-full flex justify-center items-center text-xs text-red-500 rounded-md capitalize"
                    type="button"
                    onClick={onDelete}
                >
                    <svg className="w-3.5 mr-2 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M261-120q-24 0-42.5-18.5T200-181v-539h-80v-60h240v-40h240v40h240v60h-80v539q0 23-18.5 41.5T699-120H261Zm438-600H261v539h438v-539Zm-309 460h60v-380h-60v380Zm150 0h60v-380h-60v380ZM261-720v539-539Z" />
                    </svg>

                    apagar objetivo
                </button>
            </div>

            <div className="w-full py-8 bg-white rounded-xl shadow-md">
                <div className="w-11/12 mx-auto">
                    <h2 className="text-base font-bold">{item.name}</h2>

                    <div className="w-full h-4 flex mx-auto mt-3 bg-blue-100 rounded-full relative">
                        <div className="bg-blue-400 rounded-full" style={{ width: `${totProgress}%` }} />

                        <span className="w-full h-4 flex justify-center items-center text-xs text-black font-bold absolute left-0 right-0">
                            {totProgress}%
                        </span>
                    </div>

                    {completedInfo.total > 0 && (
                        <div className="text-xs text-gray-500 mt-3 text-center">
                            {completedInfo.completed} de {completedInfo.total} entregas concluídas
                        </div>
                    )}

                    <div className="w-full flex justify-center items-center mt-8">
                        <div className="flex flex-1 border-b border-gray-200" />

                        <div className="text-xs text-gray-500 px-4">Resultados-Chave</div>

                        <div className="flex flex-1 border-b border-gray-200" />
                    </div>

                    {item.resultKeys?.map((resultKey) => {
                        const deliveryValues = resultKey.deliveries.map((delivery) => parseInt(delivery.value || "0", 10));

                        const progress = deliveryValues.length > 0 ? Math.min(Math.round(deliveryValues.reduce((a, b) => a + b, 0) / deliveryValues.length), 100) : 0;

                        return (
                            <div key={resultKey.id} className="w-full border-b border-gray-100 last:border-b-0 pb-2.5 mt-8">
                                <div className="w-full">
                                    <h2 className="text-base font-bold">{resultKey.name}</h2>
                                </div>

                                <div className="w-full flex justify-center items-center">
                                    <div className="w-full h-4 flex mx-auto bg-blue-100 rounded-full relative">
                                        <div className="bg-blue-400 rounded-full" style={{ width: `${progress}%` }} />

                                        <span className="w-full h-4 flex justify-center items-center text-xs text-black font-bold absolute left-0 right-0">{progress}%</span>
                                    </div>

                                    <button
                                        className="w-8 min-w-8 h-8 min-h-8 flex justify-center items-center border border-gray-200 rounded-md ml-5"
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