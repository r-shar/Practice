import { requireCurrentTherapist } from "@/lib/auth";
import { getClientsForTherapist } from "@/server/clients";

export const getDashboardData = async () => {
    const therapist = await requireCurrentTherapist();
    const clients = await getClientsForTherapist(therapist.id);

    return {
        therapist,
        clients,
    };
};
