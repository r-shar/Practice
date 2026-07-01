import { prisma } from "@/lib/db";
import { requireCurrentTherapist } from "@/lib/auth";
import { CreateClientInput, UpdateClientInput } from "@/lib/types";

export const getClients = async () => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.findMany({
        where: {
            therapistId: therapist.id,
        }
    });
};

export const getClientById = async (id: string) => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.findUnique({
        where: {
            id,
            therapistId: therapist.id,
        }
    });
};

export const createClient = async (data: CreateClientInput) => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.create({
        data: {
            ...data,
            therapist: {
                connect: {
                    id: therapist.id,
                }
            }
        }
    });
};

export const updateClient = async (id: string, data: UpdateClientInput) => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.update({
        where: {
            id,
            therapistId: therapist.id,
        },
        data,
    });
};

export const deleteClient = async (id: string) => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.delete({
        where: {
            id,
            therapistId: therapist.id,
        },
    });
};