import { PrismaClient } from "@prisma/client";

export async function seedCms(db: PrismaClient) {
  await db.cmsAbout.create({
    data: {
      vision:
        "Mewujudkan Sidoarjo sebagai daerah yang maju, demokratis, dan berkeadilan sosial melalui gerakan perubahan yang berkelanjutan.",
      mission:
        "Membangun kaderitas yang kuat, melayani masyarakat dengan integritas, dan mengadvokasi kebijakan pro-rakyat.",
      videoUrl: "https://www.youtube.com/embed/_bJJvcVoT7s?si=TPTbeefE70_vPyAa",
    },
  });

  await db.cmsContact.create({
    data: {
      phone: "+62 31 1234567",
      email: "dpd.sidoarjo@nasdem.id",
      address: "Jl. Raya Sidoarjo No. 123, Sidoarjo, Jawa Timur",
      operationalHours: "Senin - Jumat: 08:00 - 16:00 WIB",
      instagramUrl: "https://instagram.com/nasdemsidoarjo",
      facebookUrl: "https://facebook.com/nasdemsidoarjo",
      twitterUrl: "https://twitter.com/nasdemsidoarjo",
      youtubeUrl: "https://youtube.com/c/nasdemsidoarjo",
    },
  });

  await db.cmsHeroBanner.createMany({
    data: [
      {
        imageUrl:
          "https://i2.wp.com/nasionalnews.id/wp-content/uploads/2025/02/IMG-20250208-WA0013.jpg",
        order: 1,
        isActive: true,
      },
      {
        imageUrl:
          "https://arkdesign-architects.com/wp-content/uploads/2021/12/Nasdem-Tower-view.jpg",
        order: 2,
        isActive: true,
      },
    ],
  });
}
