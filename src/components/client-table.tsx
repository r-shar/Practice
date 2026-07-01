import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ClientListItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type ClientTableProps = {
  clients: ClientListItem[];
  deleteAction?: (formData: FormData) => void | Promise<void>;
};

export default function ClientTable({
  clients,
  deleteAction,
}: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="font-medium">No clients yet</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Add your first client to start building your caseload.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Phone</th>
            <th className="px-4 py-3 text-left font-medium">Created at</th>
            <th className="px-4 py-3 text-left font-medium">Updated at</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-medium">
                {client.firstName} {client.lastName}
              </td>
              <td className="px-4 py-3">{client.email ?? "-"}</td>
              <td className="px-4 py-3">{client.phone ?? "-"}</td>
              <td className="px-4 py-3">{formatDate(client.createdAt)}</td>
              <td className="px-4 py-3">{formatDate(client.updatedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/clients/${client.id}/edit`}>Edit</Link>
                  </Button>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={client.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      disabled={!deleteAction}
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
