import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function getEnvValue(content: string, targetKey: string): string | undefined {
  for (const originalLine of content.split("\n")) {
    const line = originalLine.endsWith("\r")
      ? originalLine.slice(0, -1)
      : originalLine;

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (key !== targetKey) {
      continue;
    }

    const value = line.slice(separatorIndex + 1).trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

function getPortFromFile(): string | undefined {
  const envPath = path.resolve(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return undefined;
  }

  try {
    const content = fs.readFileSync(envPath, "utf-8");

    return (
      getEnvValue(content, "APP_PORT") ??
      getEnvValue(content, "PORT")
    );
  } catch {
    return undefined;
  }
}

function getPort(): string {
  const envPort = process.env.APP_PORT ?? process.env.PORT;

  if (envPort) {
    return envPort.trim();
  }

  return getPortFromFile() ?? "3000";
}

const action = process.argv[2] || "dev";
const port = getPort();

const nextArgs =
  action === "start"
    ? ["start", "-p", port]
    : ["dev", "--turbopack", "-p", port];

const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: port,
    APP_PORT: port,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});