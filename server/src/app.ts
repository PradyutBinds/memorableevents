import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

import express, { type Express, type RequestHandler } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";

import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const isVercel = process.env.VERCEL === "1";
const sessionSecret = process.env.SESSION_SECRET || "ua_session_secret_2024";
const sessionMaxAge = 7 * 24 * 60 * 60 * 1000;

function getCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;

  for (const part of header.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (rawKey !== name) continue;

    return decodeURIComponent(rawValue.join("="));
  }

  return null;
}

function sign(value: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function isValidSignature(value: string, signature: string, secret: string): boolean {
  const expected = sign(value, secret);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === actualBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

function encodeSession(data: Record<string, unknown>, secret: string): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function decodeSession(
  value: string | null,
  secret: string,
): Record<string, unknown> {
  if (!value) return {};

  const [payload, signature] = value.split(".");
  if (!payload || !signature || !isValidSignature(payload, signature, secret)) {
    return {};
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function createVercelSession(secret: string): RequestHandler {
  const cookieName = "ua_admin_session";
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    maxAge: sessionMaxAge,
    path: "/",
  };
  const clearCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  };

  return (req, res, next) => {
    const sessionData = decodeSession(getCookie(req.headers.cookie, cookieName), secret);
    let changed = false;
    let destroyed = false;

    const sessionProxy = new Proxy(sessionData, {
      set(target, property, value) {
        changed = true;
        target[property as string] = value;
        return true;
      },
      deleteProperty(target, property) {
        changed = true;
        delete target[property as string];
        return true;
      },
    });

    Object.defineProperty(sessionProxy, "destroy", {
      enumerable: false,
      value(callback?: (err?: unknown) => void) {
        changed = true;
        destroyed = true;

        for (const key of Object.keys(sessionData)) {
          delete sessionData[key];
        }

        callback?.();
      },
    });

    (req as any).session = sessionProxy;

    const originalEnd = res.end.bind(res);
    res.end = ((...args: Parameters<typeof res.end>) => {
      if (!res.headersSent) {
        if (destroyed) {
          res.clearCookie(cookieName, clearCookieOptions);
        } else if (changed) {
          res.cookie(cookieName, encodeSession(sessionData, secret), cookieOptions);
        }
      }

      return originalEnd(...args);
    }) as typeof res.end;

    next();
  };
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (isVercel) {
  app.use(createVercelSession(sessionSecret));
} else {
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: sessionMaxAge,
      },
    }),
  );
}

// ======================
// API Routes
// ======================
app.use("/api", router);

app.use("/api", (_req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

// ======================
// Production Frontend
// ======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production" && !isVercel) {
  const clientDist = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientDist));

  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

export default app;
