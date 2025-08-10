// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { mockEntries } from "../src/lib/mock-data";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

function parseDateSafe(s: string | undefined) {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

async function main() {
    // Create a test user for the seed data to belong to
  const userId = process.env.SEED_USER_ID;
  if (!userId) {
    throw new Error("SEED_USER_ID not set in .env");
  }

  console.log("Seeding entries for user:", userId);

  for (const m of mockEntries) {
    // convert human date to Date object, if that fails then it's set to now
    const createdAt = parseDateSafe(m.date) ?? new Date();

    // // If your mock object uses "content" instead of "contentHtml", map here:
    // const contentHtml = (m as any).contentHtml ??  "";

    /**
     * Inserts one Entry per mock with safe defaults.
     * We use arrays/JSON now to move fast (your mock already fits this shape). We can refactor later if needed.
     */
    const entry = await prisma.entry.create({
      data: {
        userId,
        title: m.title ? m.title : null,
        contentHtml: m.contentHtml ?? null,
        createdAt,
        tags: m.tags ?? [],
        categories: m.categories ?? [],
        emotions: m.emotions ?? [],
        song: m?.song,
        people: m?.people,
        //challenges: m.challenges ? m.challenges : null,
      },
    });

    // Images
    // Creates child Image rows for each Entry. 
    if (Array.isArray(m.images) && m.images.length) {
      await prisma.image.createMany({
        data: m.images.map((url: string) => ({
          entryId: entry.id,
          url,
        })),
      });
    }

    console.log(`✓ Inserted entry ${entry.id} (${m.title ?? "Untitled"})`);
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
