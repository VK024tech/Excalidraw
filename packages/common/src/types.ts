import { z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
});


export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});


export const CreateRoomSchema = z.object({
  name: z.string(),
});
