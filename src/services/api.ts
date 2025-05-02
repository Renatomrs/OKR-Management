import api from './axios';

import { OKR, Delivery } from '../types';

export const fetchOkrs = async (): Promise<OKR[]> => {
    const response = await api.get('/okrs');
    return response.data;
};

export const createObjective = async (name: string): Promise<OKR> => {
    const response = await api.post('/okrs', {
        name,
        resultKeys: [],
    });

    return response.data;
};

export const createResultKey = async (
    okrId: string,
    name: string,
    deliveries: Delivery[]
) => {
    const response = await api.post(`/okrs/${okrId}/resultKeys`, {
        name,
        deliveries,
    });

    return response.data;
};

export const updateResultKey = async (
    okrId: string,
    resultKeyId: string,
    data: { name: string; deliveries: Delivery[] }
) => {
    const response = await api.put(`/okrs/${okrId}/resultKeys/${resultKeyId}`, data);
    return response.data;
};

export const deleteObjective = async (okrId: string) => {
    await api.delete(`/okrs/${okrId}`);
};

export const fetchOkrById = async (id: string): Promise<OKR> => {
    const response = await api.get(`/okrs/${id}`);
    return response.data;
};
