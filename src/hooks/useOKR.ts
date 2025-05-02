import { useEffect, useState } from 'react';

import { OKR } from '../types';

import * as api from '../services/api';

export function useOKR() {
    const [okrs, setOkrs] = useState<OKR[]>([]);

    const fetchOKRs = async () => {
        try {
            const data = await api.fetchOkrs();

            setOkrs(data);
        } catch (error) {
            console.error("Erro ao carregar OKRs:", error);
        }
    };

    useEffect(() => {
        fetchOKRs();
    }, []);

    const createOkr = async (name: string) => {
        try {
            await api.createObjective(name);  // Passando apenas o 'name'
            fetchOKRs();  // Atualiza a lista de OKRs
        } catch (error) {
            console.error("Erro ao criar OKR:", error);
        }
    };

    const removeOkr = async (id: string) => {
        try {
            await api.deleteObjective(id);
            fetchOKRs();
        } catch (error) {
            console.error("Erro ao remover OKR:", error);
        }
    };

    return {
        okrs,
        fetchOKRs,
        createOkr,
        removeOkr,
    };
}
