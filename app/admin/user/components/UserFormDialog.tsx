"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserInput,
  UpdateUserInput,
} from "./schemas";

interface BaseProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void;
  isSubmitting?: boolean;
}

interface CreateProps extends BaseProps {
  mode: "create";
}

interface EditProps extends BaseProps {
  mode: "edit";
  user: {
    id: number;
    username: string;
    email: string;
    role: "superadmin" | "editor" | "analyst";
  } | null;
}

type Props = CreateProps | EditProps;

export function UserFormDialog(props: Props) {
  const isEdit = props.mode === "edit";
  const schema = isEdit ? updateUserSchema : createUserSchema;

  const form = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues: isEdit
      ? {
          username: props.user?.username ?? "",
          email: props.user?.email ?? "",
          password: "",
          role: props.user?.role ?? "editor",
        }
      : { username: "", email: "", password: "", role: "editor" },
  });

  // Ensure form values are populated when opening edit dialog or when user changes
  const depUserId = isEdit ? (props as EditProps).user?.id : undefined;

  useEffect(() => {
    if (isEdit && props.open && props.user) {
      form.reset({
        username: props.user.username,
        email: props.user.email,
        password: "",
        role: props.user.role,
      });
    }
    if (!props.open && !isEdit) {
      // Reset to create defaults when closing create dialog
      form.reset({ username: "", email: "", password: "", role: "editor" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, props.open, depUserId]);

  const handleSubmit = (values: any) => {
    if (isEdit) {
      const payload: UpdateUserInput = {
        id: props.user!.id,
        username: values.username,
        email: values.email,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };

      props.onSubmit(payload);
    } else {
      const payload: CreateUserInput = values;
      props.onSubmit(payload);
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Tambah User Baru"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="nama@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isEdit ? "Password (opsional)" : "Password"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          isEdit
                            ? "Kosongkan jika tidak diubah"
                            : "Minimal 8 karakter"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => props.onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={props.isSubmitting}>
                {props.isSubmitting
                  ? "Menyimpan..."
                  : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
