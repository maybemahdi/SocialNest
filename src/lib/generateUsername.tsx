export const generateRandomUsername = (name: string) => {
    // Remove spaces and make lowercase
    const baseName = name.toLowerCase().replace(/\s+/g, '');

    // Generate a random number between 100 and 999 (you can adjust as needed)
    const randomNumber = Math.floor(100 + Math.random() * 900);

    // Combine base name with random number
    const username = `${baseName}${randomNumber}`;
    return username;
};