import Dashboard from "@/components/dashboard";
import { requireCurrentTherapist } from "@/lib/auth";

export default async function DashboardPage() {
  const therapist = await requireCurrentTherapist();

  return <Dashboard therapistId={therapist.id} />;
}
