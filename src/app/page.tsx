"use client"

import axios from 'axios';

import { useEffect, useState } from "react";

import ObjectiveCard from "./components/Card/Objective";
import Popup from './components/PopUp';
import Form from './components/Card/Form';

interface Delivery {
  name: string;
  value: string;
}

interface ResultKey {
  createdAt: string;
  name: string;
  deliveries: Delivery[];
  id: string;
  okrId: string;
}

interface OKR {
  createdAt: string;
  name: string;
  id: string;
  resultKeys: ResultKey[];
}

export default function Home() {
  const [data, setData] = useState<OKR[]>([])

  const [newObjectiveName, setNewObjectiveName] = useState("");

  const [newResultKeyName, setNewResultKeyName] = useState("");
  const [newDeliveryName, setNewDeliveryName] = useState("");
  const [newDeliveryValue, setNewDeliveryValue] = useState("");
  const [selectedOkrId, setSelectedOkrId] = useState<string | null>();

  const [editingResultKey, setEditingResultKey] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<{ name: string; deliveries: Delivery[] } | null>(null);

  const [openPopupObjective, setOpenPopupObjective] = useState(false);
  const [openPopupAddKeyResult, setOpenPopupAddkeyResult] = useState(false);
  const [openPopupKeyResultEdit, setOpenPopupkeyResultEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<OKR[]>('https://67a67e77510789ef0dfb8c44.mockapi.io/api/okrs');
        setData(response.data);

      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleCreateObjective = async () => {
    if (newObjectiveName.trim() === "") {
      alert("Por favor, preencha o nome do objetivo.");
      return;
    }

    try {
      const newObjective = {
        name: newObjectiveName,
        resultKeys: [],
      };

      const response = await axios.post('https://67a67e77510789ef0dfb8c44.mockapi.io/api/okrs', newObjective);

      setData([...data, response.data]);
      setNewObjectiveName("");
      setOpenPopupObjective(false);

    } catch (error) {
      console.error("Error creating objective:", error);
    }

    setOpenPopupObjective(false)
  };

  const handleCreateResultKeyWithDelivery = async () => {
    if (!newResultKeyName.trim() || !newDeliveryName.trim() || !newDeliveryValue.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const newResultKey = {
        name: newResultKeyName,
        deliveries: [{ name: newDeliveryName, value: parseInt(newDeliveryValue, 10) }],
      };

      const response = await axios.post(
        `https://67a67e77510789ef0dfb8c44.mockapi.io/api/okrs/${selectedOkrId}/resultKeys`,
        newResultKey,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Resposta da API (sucesso):", response.data);

      setData(data.map(okr =>
        okr.id === selectedOkrId
          ? { ...okr, resultKeys: [...okr.resultKeys, response.data] }
          : okr
      ));

      setNewResultKeyName("");
      setNewDeliveryName("");
      setNewDeliveryValue("");

      setOpenPopupAddkeyResult(false)

    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao criar o resultado chave.");
    }
  };

  const handleEdit = (okrId: string, resultKeyId: string) => {
    setEditingResultKey(resultKeyId);
    setOpenPopupkeyResultEdit(true);

    const okrFound = data.find(okr => okr.id === okrId);

    if (okrFound) {
      const resultKeyToEdit = okrFound.resultKeys.find(rk => rk.id === resultKeyId);
      if (resultKeyToEdit) {
        setFormValues({
          name: resultKeyToEdit.name,
          deliveries: resultKeyToEdit.deliveries.map(delivery => ({ ...delivery })),
        });
      } else {
        setFormValues(null);
      }
    } else {
      setFormValues(null);
    }
  };

  const handleUpdateResultKey = async () => {
    if (!formValues || !editingResultKey || !selectedOkrId) return;

    try {
      const updatedResultKey = {
        name: formValues.name,
        deliveries: formValues.deliveries,
      };

      const response = await axios.put(
        `https://67a67e77510789ef0dfb8c44.mockapi.io/api/okrs/${selectedOkrId}/resultKeys/${editingResultKey}`,
        updatedResultKey,
        { headers: { "Content-Type": "application/json" } }
      );

      setData(data.map(okr => {
        if (okr.id === selectedOkrId) {
          const updatedResultKeys = okr.resultKeys.map(rk =>
            rk.id === editingResultKey ? response.data : rk
          );
          return { ...okr, resultKeys: updatedResultKeys };
        }
        return okr;
      }));

      setOpenPopupkeyResultEdit(false);
      setEditingResultKey(null);
      setFormValues(null);
    } catch (error) {
      console.error("Erro ao atualizar ResultKey:", error);
      alert("Erro ao atualizar o Resultado-Chave.");
    }
  };

  if (!data.length) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="w-14 h-14 animate-spin border-gray-800 border-t-2 border-r-2 border-b-2 border-l-2 border-r-transparent border-l-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-[1250px] mx-auto grid min-h-screen pb-20">
      <div className="w-full flex justify-between items-center mt-14 md:mt-8 mb-8">
        <h1 className="font-bold">Lista de OKRs</h1>

        <button
          className="h-9 flex justify-center items-center px-5 bg-blue-400 text-sm text-white rounded-md capitalize"
          type="button"
          onClick={() => setOpenPopupObjective((open) => !open)}
        >
          criar objetivo
        </button>
      </div>

      <main className={data.length < 2 ? "grid grid-cols-1 gap-8" : "grid grid-cols-1 gap-8 md:grid-cols-2"}>
        {data?.map((item) => (
          <ObjectiveCard
            key={item.id}
            item={item}
            onClick={(resultKeyId: string) => handleEdit(item.id, resultKeyId)}

            addResultKey={(okrId: string) => {
              setSelectedOkrId(okrId);
              setOpenPopupAddkeyResult(true);
            }}
          />
        ))}
      </main>

      <Popup state={openPopupObjective}>
        <Form
          title={"Criar novo objetivo"}
          text={"Novo objetivo"}
          onClose={() => setOpenPopupObjective((open) => !open)}
        >
          <input className="w-full h-12 mx-auto text-sm md:text-base mt-10 px-5 border border-gray-200 rounded-md"
            type="text"
            placeholder="Digite o objetivo"
            value={newObjectiveName}
            onChange={(e) => setNewObjectiveName(e.target.value)}
          />

          <button
            className="w-full h-12 mx-auto bg-blue-400 text-base text-white rounded-md mt-5"
            type="button"
            onClick={handleCreateObjective}
          >
            Salvar
          </button>
        </Form>
      </Popup>

      <Popup state={openPopupAddKeyResult}>
        <Form
          title={"Criar novo Resultado-Chave"}
          text={"Resultado-Chave"}
          onClose={() => setOpenPopupAddkeyResult(false)}
        >
          <input
            className="w-full h-12 mx-auto text-sm md:text-base mt-10 px-5 border border-gray-200 rounded-md"
            type="text"
            placeholder="Digite o Resultado-Chave"
            value={newResultKeyName}
            onChange={(e) => setNewResultKeyName(e.target.value)}
          />

          <div className='w-full flex flex-wrap gap-5 mt-5'>
            <div className='w-full flex justify-normal items-center gap-5'>
              <input
                className="w-full flex flex-1 h-12 text-sm md:text-base px-5 border border-gray-200 rounded-md"
                type="text"
                placeholder="Digite a entrega"
                value={newDeliveryName}
                onChange={(e) => setNewDeliveryName(e.target.value)}
              />

              <input
                className="w-[100px] min-w-[100px] h-12 flex justify-center items-center text-sm md:text-base px-5 border border-gray-200 rounded-md"
                type="text"
                placeholder="Valor %"
                maxLength={3}
                value={newDeliveryValue}
                onChange={(e) => setNewDeliveryValue(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full h-12 mx-auto bg-blue-400 text-base text-white rounded-md mt-5"
            type="button"
            onClick={handleCreateResultKeyWithDelivery}
          >
            Salvar
          </button>
        </Form>
      </Popup>

      {!openPopupAddKeyResult &&
        (
          <Popup state={openPopupKeyResultEdit}>
            <Form
              title={"Editar Resultado-Chave"}
              text={"Resultado-Chave"}
              onClose={() => {
                setOpenPopupkeyResultEdit(false);
                setEditingResultKey(null);
                setFormValues(null);
              }}
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
                            const updatedDeliveries = [...formValues.deliveries];
                            updatedDeliveries.splice(index, 1);
                            setFormValues({ ...formValues, deliveries: updatedDeliveries });
                          }}
                        >
                          <svg className="w-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="h-full flex justify-center items-center mt-5 text-xs text-blue-500 rounded-md capitalize"
                    type="button"
                    onClick={() => setOpenPopupAddkeyResult((open) => !open)}
                  >
                    <span className="w-5 h-5 flex justify-center items-center text-lg mr-1">
                      <svg className="w-4 fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
                    </span>

                    Adicionar entrega
                  </button>
                </>
              )}

              <button
                className="w-full h-12 mx-auto bg-blue-400 text-base text-white rounded-md mt-5"
                type="button"
                onClick={handleUpdateResultKey}
              >
                Salvar
              </button>
            </Form>
          </Popup>
        )}
    </div>
  );
}
