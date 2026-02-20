"use server";

import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";

// Define the absolute path to our secret vault
const DATA_DIR = path.join(process.cwd(), "data", "timers");

export async function saveTimerConfig(slug: string, jsonString: string) {
  try {
    // 1. Ensure the directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // 2. Define the file path
    const filePath = path.join(DATA_DIR, `${slug}.json`);

    // 3. Check if file already exists (to prevent overwriting)
    try {
      await fs.access(filePath);
      return {
        error:
          "A timer with this slug already exists. Please choose a different one.",
      };
    } catch {
      // File doesn't exist, proceed to save
    }

    // 4. Validate JSON one last time on the server
    const parsedData = JSON.parse(jsonString);

    // 5. Save the file
    await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), "utf-8");
  } catch (err) {
    console.error("Save error:", err);
    return { error: "Failed to save configuration. Please try again." };
  }

  // 6. Redirect to the newly created timer page
  redirect(`/t/${slug}`);
}
