import { db } from "./lib/db";

async function checkAdminUsers() {
  console.log("🔍 Checking Admin Users...\n");

  const users = await db.user.findMany({
    orderBy: { id: "asc" },
  });

  console.log(`Found ${users.length} users:\n`);

  if (users.length === 0) {
    console.log("❌ No users found in database!");
    console.log("\n💡 Solution: Run seed script to create admin users");
  } else {
    users.forEach((u: any) => {
      console.log(`ID: ${u.id}`);
      console.log(`Username: ${u.username}`);
      console.log(`Email: ${u.email}`);
      console.log(`Role: ${u.role}`);
      console.log("---");
    });
  }

  await db.$disconnect();
}

checkAdminUsers().catch(console.error);
