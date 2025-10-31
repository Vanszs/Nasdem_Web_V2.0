import { PrismaClient } from "@prisma/client";

export async function seedActivities(db: PrismaClient) {
  await db.$transaction(async (tx) => {
    const a1 = await (tx as any).activity.create({
      data: {
        title: "Rapat Koordinasi DPD",
        description: "Rapat koordinasi pengurus membahas program kerja 2025",
        category: "internal",
        eventDate: new Date("2024-01-15"),
        location: "Kantor DPD NasDem Sidoarjo",
      },
    });

    await (tx as any).activityMedia.createMany({
      data: [
        {
          activityId: a1.id,
          type: "image",
          url: "https://i.ytimg.com/vi/8c23rO8r0yc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCqlXnTDUdl_4zt1E_OGCpuOhXu4w",
          caption: "Pembukaan rapat",
          order: 0,
        },
        {
          activityId: a1.id,
          type: "image",
          url: "https://i.ytimg.com/vi/1UaElu_gwKw/hqdefault.jpg",
          caption: "Diskusi program",
          order: 1,
        },
      ],
    });

    const a2 = await (tx as any).activity.create({
      data: {
        title: "Bakti Sosial Ramadan",
        description: "Program bakti sosial membagikan sembako",
        category: "sosial",
        eventDate: new Date("2024-03-20"),
        location: "Kelurahan Sidoarjo",
      },
    });

    await (tx as any).activityMedia.createMany({
      data: [
        {
          activityId: a2.id,
          type: "image",
          url: "https://cdn.antaranews.com/cache/1200x800/2025/10/09/IMG_20251009_232808.jpg",
          caption: "Pembagian sembako",
          order: 0,
        },
        {
          activityId: a2.id,
          type: "video",
          url: "https://www.youtube.com/embed/_bJJvcVoT7s?si=TPTbeefE70_vPyAa",
          caption: "Rangkuman kegiatan",
          order: 1,
        },
      ],
    });
  });
}
