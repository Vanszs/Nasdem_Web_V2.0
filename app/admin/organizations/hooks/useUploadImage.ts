import { useMutation } from "@tanstack/react-query";

async function uploadImage(params: {
  file: File;
  scope?: "member" | "program" | "struktur" | "caleg";
}) {
  const { file, scope = "member" } = params;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("scope", scope);
  const res = await fetch(`/api/upload?scope=${scope}`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!res.ok || !json.success || !json.url) {
    throw new Error(json.error || "Gagal upload gambar");
  }
  return json as {
    url: string;
    scope: string;
    filename: string;
    mime: string;
    size: number;
  };
}

export function useUploadImage() {
  return useMutation({ mutationFn: uploadImage });
}
