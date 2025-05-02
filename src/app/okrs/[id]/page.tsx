"use client";

import { useEffect, useState, useCallback } from "react";

import { useParams, useRouter } from "next/navigation";

import { fetchOkrById, createResultKey, updateResultKey, deleteObjective } from "@/services/api";

import { OKR, Delivery } from "@/types";

import ObjectiveCard from "@/components/Card/Objective";
import Popup from "@/components/PopUp/Popup";
import Form from "@/components/Form/Form";
import ObjectiveCardSkeleton from "@/components/Card/ObjectiveSkeleton";

export default function OkrDetailsPage() {
    const { id } = useParams<any>();

    const router = useRouter();

    const [okr, setOkr] = useState<OKR | null>(null);

    const [newResultKeyName, setNewResultKeyName] = useState("");
    const [deliveries, setDeliveries] = useState<Delivery[]>([{ name: "", value: "" }]);
    const [selectedOkrId, setSelectedOkrId] = useState<string | null>();
    const [editingResultKey, setEditingResultKey] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<{ id: string; name: string; deliveries: Delivery[] } | null>(null);
    const [openPopupAddKeyResult, setOpenPopupAddkeyResult] = useState(false);
    const [openPopupKeyResultEdit, setOpenPopupkeyResultEdit] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOkr = useCallback(async (okrId: string) => {
        if (!okrId) {
            setError("ID não encontrado.");
            setLoading(false);

            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await fetchOkrById(okrId);
            setOkr(data);

        } catch (err: any) {
            setError("Erro ao buscar OKR. Tente novamente mais tarde.");
            console.error("Erro ao buscar OKR:", err.message);

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchOkr(id);
        }

    }, [id, fetchOkr]);

    const handleCreateResultKeyWithDelivery = async () => {
        if (!newResultKeyName.trim() || deliveries.some(d => !d.name.trim() || !d.value.trim())) {
            alert("Preencha todos os campos.");
            return;
        }

        if (!okr?.id) {
            console.error("ID do OKR não encontrado para criar resultado-chave.");
            return;
        }

        try {
            const response = await createResultKey(okr.id, newResultKeyName, deliveries);

            setOkr({ ...okr, resultKeys: [...okr.resultKeys, response] });
            setNewResultKeyName("");
            setDeliveries([{ name: "", value: "" }]);
            setOpenPopupAddkeyResult(false);

        } catch (error) {
            console.error("Erro ao criar resultado chave:", error);
        }
    };

    const handleEdit = (resultKeyId: string) => {
        if (!okr) return;

        setEditingResultKey(resultKeyId);
        setSelectedOkrId(okr.id);
        setOpenPopupkeyResultEdit(true);

        const resultKey = okr.resultKeys.find(rk => rk.id === resultKeyId);
        if (resultKey) {
            setFormValues({ ...resultKey, deliveries: resultKey.deliveries.map(d => ({ ...d })) });
        }
    };

    const handleUpdateResultKey = async () => {
        if (!formValues || !editingResultKey || !okr?.id) return;

        try {
            const updated = await updateResultKey(okr.id, editingResultKey, formValues);
            setOkr({
                ...okr,
                resultKeys: okr.resultKeys.map(rk => rk.id === editingResultKey ? updated : rk)
            });

            setOpenPopupkeyResultEdit(false);
            setEditingResultKey(null);
            setFormValues(null);

        } catch (error) {
            console.error("Erro ao atualizar resultado chave:", error);
        }
    };

    const handleDeleteObjective = async (okrId: string) => {
        if (!okr?.id || okr.id !== okrId) {
            console.error("ID do OKR incorreto para deletar.");
            return;
        }

        try {
            await deleteObjective(okrId);
            router.push('/okrs');

        } catch (error) {
            console.error("Erro ao deletar objetivo:", error);
        }
    };

    return (
        <div className="w-full min-h-screen py-8 font-sans">
            <main className="w-11/12 max-w-[700px] mx-auto flex flex-col gap-4">
                <h1 className="text-xl font-bold md:text-2xl">Detalhes do Objetivo</h1>

                {loading ? (
                    <ObjectiveCardSkeleton />

                ) : okr ? (
                    <ObjectiveCard
                        item={okr}
                        onClick={(resultKeyId: string) => handleEdit(resultKeyId)}
                        addResultKey={() => setOpenPopupAddkeyResult(true)}
                        onDelete={() => {
                            const confirmDelete = window.confirm("Tem certeza que deseja apagar este objetivo com todos os resultados-chave?");
                            if (confirmDelete) {
                                handleDeleteObjective(okr.id);
                            }
                        }}
                    />
                ) : (
                    <p className="text-red-500">Objetivo não encontrado.</p>
                )}
            </main>

            <Popup state={openPopupAddKeyResult}>
                <Form
                    title={"Criar Resultado-Chave"}
                    text={"Resultado-Chave"}
                    onClose={() => setOpenPopupAddkeyResult(false)}
                    onClick={handleCreateResultKeyWithDelivery}
                >
                    <input
                        className="w-full h-12 mx-auto text-sm md:text-base mt-10 px-5 border border-gray-200 rounded-md"
                        type="text"
                        placeholder="Digite o Resultado-Chave"
                        value={newResultKeyName}
                        onChange={(e) => setNewResultKeyName(e.target.value)}
                    />

                    {deliveries.map((delivery, index) => (
                        <div key={index} className="w-full flex justify-normal items-center gap-5 mt-3">
                            <input
                                className="w-full flex flex-1 h-12 text-sm md:text-base px-5 border border-gray-200 rounded-md"
                                type="text"
                                placeholder="Entrega"
                                value={delivery.name}
                                onChange={(e) => {
                                    const updated = [...deliveries];
                                    updated[index].name = e.target.value;
                                    setDeliveries(updated);
                                }}
                            />
                            <input
                                className="w-[100px] min-w-[100px] h-12 text-sm md:text-base px-5 border border-gray-200 rounded-md"
                                type="text"
                                placeholder="%"
                                value={delivery.value}
                                onChange={(e) => {
                                    const updated = [...deliveries];
                                    updated[index].value = e.target.value;
                                    setDeliveries(updated);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = deliveries.filter((_, i) => i !== index);
                                    setDeliveries(updated.length ? updated : [{ name: "", value: "" }]);
                                }}
                            >
                                <svg className="w-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                            </button>
                        </div>
                    ))}

                    <button
                        className="mt-3 text-blue-500 text-sm"
                        type="button"
                        onClick={() => setDeliveries([...deliveries, { name: "", value: "" }])}
                    >
                        + Adicionar entrega
                    </button>
                </Form>
            </Popup>

            <Popup state={openPopupKeyResultEdit}>
                <Form
                    title={"Editar Resultado-Chave"}
                    text={"Resultado-Chave"}
                    onClose={() => {
                        setOpenPopupkeyResultEdit(false);
                        setEditingResultKey(null);
                        setFormValues(null);
                    }}
                    onClick={handleUpdateResultKey}
                >
                    {formValues && (
                        <>
                            <input
                                className="w-full h-12 mx-auto text-sm md:text-base mt-10 px-5 border border-gray-200 rounded-md"
                                type="text"
                                placeholder="Resultado-Chave"
                                value={formValues.name}
                                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                            />

                            <div className='w-full flex flex-wrap gap-5 mt-5'>
                                {formValues.deliveries.map((delivery, index) => (
                                    <div key={index} className='w-full flex justify-normal items-center gap-5'>
                                        <input
                                            className="w-full flex flex-1 h-12 text-sm md:text-base px-5 border border-gray-200 rounded-md"
                                            type="text"
                                            placeholder="Entrega"
                                            value={delivery.name}
                                            onChange={(e) => {
                                                const updatedDeliveries = [...formValues.deliveries];
                                                updatedDeliveries[index] = { ...delivery, name: e.target.value };
                                                setFormValues({ ...formValues, deliveries: updatedDeliveries });
                                            }}
                                        />
                                        <input
                                            className="w-[72px] min-w-[72px] h-12 flex justify-center items-center text-sm md:text-base px-5 border border-gray-200 rounded-md"
                                            type="text"
                                            placeholder="Valor"
                                            maxLength={3}
                                            value={delivery.value}
                                            onChange={(e) => {
                                                const updatedDeliveries = [...formValues.deliveries];
                                                updatedDeliveries[index] = { ...delivery, value: e.target.value };
                                                setFormValues({ ...formValues, deliveries: updatedDeliveries });
                                            }}
                                        />
                                        <button
                                            className='w-8 min-w-8 h-8 min-h-12 flex justify-end items-center'
                                            type='button'
                                            onClick={() => {
                                                const updated = formValues.deliveries.filter((_, i) => i !== index);
                                                setFormValues({ ...formValues, deliveries: updated.length ? updated : [{ name: "", value: "" }] });
                                            }}
                                        >
                                            <svg className="w-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="mt-3 text-blue-500 text-sm"
                                type="button"
                                onClick={() =>
                                    formValues &&
                                    setFormValues({
                                        ...formValues,
                                        deliveries: [...formValues.deliveries, { name: "", value: "" }],
                                    })
                                }
                            >
                                + Adicionar nova entrega
                            </button>
                        </>
                    )}
                </Form>
            </Popup>
        </div>
    );
}