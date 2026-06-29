import { requireCurrentTherapist } from "@/lib/therapists";
import ProviderDashboard from "@/components/dashboard/provider-dashboard";

export default async function DashboardPage() {
  const therapist = await requireCurrentTherapist();

  return <ProviderDashboard therapistId={therapist.id} />;
}
