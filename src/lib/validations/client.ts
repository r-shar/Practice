import { z } from "zod";

export const clientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.union([z.email("Enter a valid email"), z.literal("")]),
  phone: z.string(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
