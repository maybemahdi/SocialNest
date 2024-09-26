import { connectDB } from "./connectDB";

export const generateRandomUsername = async (name: string) => {
    const db = await connectDB();
    const userCollection = db.collection("users");

    let isUnique = false;
    let username = "";

    // Keep generating a username until a unique one is found
    while (!isUnique) {
        // Remove spaces and make lowercase
        const baseName = name.toLowerCase().replace(/\s+/g, "");

        // Generate a random number between 100 and 999
        const randomNumber = Math.floor(100 + Math.random() * 900);

        // Combine base name with random number
        username = `${baseName}${randomNumber}`;

        // Check if the username already exists in the database
        const existingUser = await userCollection.findOne({ username });

        // If no user exists with this username, mark it as unique
        if (!existingUser) {
            isUnique = true;
        }
    }

    return username;
};