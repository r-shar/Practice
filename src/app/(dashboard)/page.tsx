import Dashboard from "@/components/dashboard";
import { getDashboardData } from "@/server/dashboard";

export default async function DashboardPage() {
  const { therapist, clients } = await getDashboardData();

  return <Dashboard therapist={therapist} clients={clients} />;
}
