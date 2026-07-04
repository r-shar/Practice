"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/server/clients";
import type { ClientFormValues } from "@/lib/validations/client";

export async function createClientAction(values: ClientFormValues) {
  await createClient({
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email || undefined,
    phone: values.phone || undefined,
  });

  redirect("/"); // temporarily redirect to home directory until client management is implemented
}
