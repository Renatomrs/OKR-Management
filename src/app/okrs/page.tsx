"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { fetchOkrs, createObjective } from "@/services/api";

import { OKR } from "@/types";

import ObjectiveCard from "@/components/Card/Objective";
import Popup from "@/components/PopUp/Popup";
import Form from "@/components/Form/Form";
import ObjectiveCardSkeletons from "@/components/Card/ObjectiveSkeletons";

export default function OkrsPage() {
    const [data, setData] = useState<OKR[]>([]);
    const [newObjectiveName, setNewObjectiveName] = useState("");

    const [selectedOkrId, setSelectedOkrId] = useState<string | null>();
    const [openPopupObjective, setOpenPopupObjective] = useState(false);
    const [openPopupAddKeyResult, setOpenPopupAddkeyResult] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOkrs = async () => {
            try {
                setLoading(true);

                const okrs = await fetchOkrs();
                const ordered = okrs.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setData(ordered);
            } catch (err: any) {
                console.error(err);

                setError(err);

            } finally {
                setLoading(false);
            }
        };

        loadOkrs();
    }, []);

    const handleCreateObjective = async () => {
        if (newObjectiveName.trim() === "") return alert("Preencha o nome do objetivo.");

        try {
            const response = await createObjective(newObjectiveName);
            setData([...data, response]);
            setNewObjectiveName("");
            setOpenPopupObjective(false);

        } catch (error) {
            console.error("Erro ao criar objetivo:", error);
        }
    };

    return (
        <div className="w-11/12 max-w-[1250px] mx-auto grid min-h-screen pb-20">
            <div className="w-full flex justify-between items-center mt-14 md:mt-8 mb-8 md:mb-4">
                <h1 className="font-bold">Lista de OKRs</h1>

                <button
                    className="h-9 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white px-5 shadow-md transition duration-300 text-sm rounded-md capitalize"
                    type="button"
                    onClick={() => setOpenPopupObjective((open) => !open)}
                >
                    criar objetivo
                </button>
            </div>

            <main className="grid grid-cols-1 gap-8 md:grid-cols-2 relative">
                {loading ? (
                    <ObjectiveCardSkeletons />

                ) : data && data.length > 0 ? (
                    data.map((item) => (
                        <Link key={item.id} href={`/okrs/${item.id}`}>
                            <ObjectiveCard
                                item={item}
                                onClick={() => { }}
                                addResultKey={(okrId: string) => {
                                    setSelectedOkrId(okrId);
                                    setOpenPopupAddkeyResult(true);
                                }}
                                onDelete={() => { }}
                            />
                        </Link>
                    ))
                ) : (
                    <div className="w-full mx-auto text-center py-10 absolute top-0 left-0 right-0 bottom-0">
                        <p className="text-lg mb-4">Não há OKRs para mostrar.</p>
                    </div>
                )}
            </main>

            <Popup state={openPopupObjective}>
                <Form
                    title={"Criar Objetivo"}
                    text={"Novo objetivo"}
                    onClose={() => setOpenPopupObjective((open) => !open)}
                    onClick={handleCreateObjective}
                >
                    <input className="w-full h-12 mx-auto text-sm md:text-base mt-10 px-5 border border-gray-200 rounded-md"
                        type="text"
                        placeholder="Digite o objetivo"
                        value={newObjectiveName}
                        onChange={(e) => setNewObjectiveName(e.target.value)}
                    />
                </Form>
            </Popup>
        </div>
    );
}