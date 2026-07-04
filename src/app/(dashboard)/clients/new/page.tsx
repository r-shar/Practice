import ClientForm from "@/components/client-form";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Client</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Add a new client to your caseload.
        </p>
      </div>

      <ClientForm />
    </div>
  );
}