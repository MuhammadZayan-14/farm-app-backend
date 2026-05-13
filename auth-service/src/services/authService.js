import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const registerUser = async (data) => {
    const hashed = await bcrypt.hash(data.password, 10);

    const result = await db.insert(users).values({
        name: data.name,
        email: data.email,
        password: hashed,
    }).returning();

    return result[0];
};

export const loginUser = async (email, password) => {
    const rows = await db.select().from(users).where(eq(users.email, email));
    const user = rows[0];

    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid password");

    return user;
};