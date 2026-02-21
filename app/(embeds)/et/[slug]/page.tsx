import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import Timer from "@/components/time/Timer";
import { getServerTime } from "@/components/actions/time";

export default async function TimerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const serverTimeMs = await getServerTime();

  const filePath = path.join(process.cwd(), "data", "timers", `${slug}.json`);

  let config;
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    config = JSON.parse(fileContent);
  } catch (err) {
    // If file doesn't exist or is invalid, show 404
    notFound();
  }

  return <Timer config={config} serverTimeMs={serverTimeMs} />;
}
