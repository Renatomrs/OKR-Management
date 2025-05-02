export interface Delivery {
    name: string;
    value: string;
}

export interface ResultKey {
    createdAt: string;
    name: string;
    deliveries: Delivery[];
    id: string;
    okrId: string;
}

export interface OKR {
    createdAt: string;
    name: string;
    id: string;
    resultKeys: ResultKey[];
}