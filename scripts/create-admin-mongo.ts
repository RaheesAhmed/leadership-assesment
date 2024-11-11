import { MongoClient } from "mongodb";
import { hash } from "bcrypt";

async function createAdmin() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not defined");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(); // Your database name will be from the URI

    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error("Please provide email and password");
      process.exit(1);
    }

    const hashedPassword = await hash(password, 10);

    const result = await db.collection("User").updateOne(
      { email },
      {
        $set: {
          email,
          password: hashedPassword,
          isAdmin: true,
          name: "Admin User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("Admin user created successfully:", result);
  } finally {
    await client.close();
  }
}

createAdmin().catch(console.error);
