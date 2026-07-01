export type CreateClientInput = {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
};

export type UpdateClientInput = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
};

export type ClientListItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    createdAt: Date | string;
    updatedAt?: Date | string | null;
};