import { PrismaClient } from "@prisma/client";

export async function seedParties(db: PrismaClient) {
  await db.party.createMany({
    data: [
      {
        name: "Partai NasDem",
        abbreviation: "NASDEM",
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/5/5a/Nasdem_logo.png",
      },
      { name: "Partai A", abbreviation: "PA", logoUrl: "/logos/a.png" },
      { name: "Partai B", abbreviation: "PB", logoUrl: "/logos/b.png" },
    ],
  });
}
