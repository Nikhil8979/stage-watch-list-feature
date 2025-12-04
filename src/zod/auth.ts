import { z } from "zod";
export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UserLoginType = z.infer<typeof UserLoginSchema>;
