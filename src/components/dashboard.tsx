import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientTable from "./client-table";
import { getClients } from "@/server/clients";
import { Button } from "./ui/button";
import Link from "next/link";

type DashboardProps = {
  therapistId: string;
};

export default async function Dashboard({ therapistId }: DashboardProps) {
  const clients = await getClients();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome back.</p>
          <p className="text-muted-foreground text-sm mt-2">
            Therapist ID: {therapistId}
          </p>
        </CardContent>
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/clients/new">Add Client</Link>
          </Button>
        </div>
        <ClientTable clients={clients} />
      </Card>
    </div>
  );
}
