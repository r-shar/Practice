import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientTable from "./client-table";
import { Button } from "./ui/button";
import Link from "next/link";
import type { ClientListItem } from "@/lib/types";

type DashboardProps = {
  therapist: {
    firstName: string | null;
    lastName: string | null;
  };
  clients: ClientListItem[];
};

export default function Dashboard({ therapist, clients }: DashboardProps) {
  const therapistName = [therapist.firstName, therapist.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome back{therapistName ? `, ${therapistName}` : ""}.</p>
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
