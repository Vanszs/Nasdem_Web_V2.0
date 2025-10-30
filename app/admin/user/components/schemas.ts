import { z } from "zod";

export const roleEnum = z.enum(["superadmin", "editor", "analyst"], {
  errorMap: () => ({ message: "Role tidak valid" }),
});

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username terlalu panjang"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Kata sandi harus mengandung huruf besar, huruf kecil, dan angka"
    ),
  role: roleEnum,
});

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(50, "Username terlalu panjang")
      .optional(),
    email: z.string().email("Format email tidak valid").optional(),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Kata sandi harus mengandung huruf besar, huruf kecil, dan angka"
      )
      .optional()
      .or(z.literal("")),
    role: roleEnum.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Tidak ada perubahan yang dikirim"
  );

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema> & { id: number };
