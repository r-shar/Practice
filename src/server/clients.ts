import { prisma } from "@/lib/db";
import { requireCurrentTherapist } from "@/lib/auth";
import { CreateClientInput, UpdateClientInput } from "@/lib/types";

export const getClientsForTherapist = async (therapistId: string) => {
    return prisma.client.findMany({
        where: {
            therapistId,
        }
    });
};

export const getClients = async () => {
    const therapist = await requireCurrentTherapist();

    return getClientsForTherapist(therapist.id);
};

export const getClientById = async (id: string) => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.findFirst({
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

    return prisma.client.updateMany({
        where: {
            id,
            therapistId: therapist.id,
        },
        data,
    });
};

export const deleteClient = async (id: string) => {
    const therapist = await requireCurrentTherapist();

    return prisma.client.deleteMany({
        where: {
            id,
            therapistId: therapist.id,
        },
    });
};