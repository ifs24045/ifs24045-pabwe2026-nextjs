import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function getPort(): string {
  if (process.env.APP_PORT) {
    return process.env.APP_PORT.trim();
  }

  if (process.env.PORT) {
    return process.env.PORT.trim();
  }

  const envPath = path.resolve(process.cwd(), ".env");

  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, "utf-8");

      let appPort: string | undefined;
      let port: string | undefined;

      for (const line of content.split(/\r?\n/)) {
        const separatorIndex = line.indexOf("=");

        if (separatorIndex === -1) {
          continue;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();

        if (!value) {
          continue;
        }

        if (key === "APP_PORT") {
          appPort = value;
        } else if (key === "PORT") {
          port = value;
        }
      }

      if (appPort) {
        return appPort;
      }

      if (port) {
        return port;
      }
    } catch {
      // fallback jika file .env tidak dapat dibaca
    }
  }

  return "3000";
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