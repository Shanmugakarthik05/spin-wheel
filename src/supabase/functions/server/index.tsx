import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8ff233bb/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all game state (teams, questions, rounds, currentRound)
app.get("/make-server-8ff233bb/state", async (c) => {
  try {
    const teams = await kv.get("teams") || [];
    const questions = await kv.get("questions") || [];
    const currentRound = await kv.get("currentRound") || 1;
    const rounds = await kv.get("rounds") || [
      {
        number: 1,
        name: 'Style Battle',
        maxTeams: 30,
        description: 'Test on HTML + CSS skills',
      },
      {
        number: 2,
        name: 'Design Remix',
        maxTeams: 20,
        description: 'Creative design twist challenge',
      },
      {
        number: 3,
        name: 'UXcellence Grand Showdown',
        maxTeams: 10,
        description: 'Final design presentation & justification',
      },
    ];

    return c.json({ teams, questions, currentRound, rounds });
  } catch (error) {
    console.error("Error fetching state:", error);
    return c.json({ error: "Failed to fetch state" }, 500);
  }
});

// Update teams
app.post("/make-server-8ff233bb/teams", async (c) => {
  try {
    const teams = await c.req.json();
    await kv.set("teams", teams);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating teams:", error);
    return c.json({ error: "Failed to update teams" }, 500);
  }
});

// Update questions
app.post("/make-server-8ff233bb/questions", async (c) => {
  try {
    const questions = await c.req.json();
    await kv.set("questions", questions);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating questions:", error);
    return c.json({ error: "Failed to update questions" }, 500);
  }
});

// Update current round
app.post("/make-server-8ff233bb/currentRound", async (c) => {
  try {
    const { currentRound } = await c.req.json();
    await kv.set("currentRound", currentRound);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating current round:", error);
    return c.json({ error: "Failed to update current round" }, 500);
  }
});

// Update rounds
app.post("/make-server-8ff233bb/rounds", async (c) => {
  try {
    const rounds = await c.req.json();
    await kv.set("rounds", rounds);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating rounds:", error);
    return c.json({ error: "Failed to update rounds" }, 500);
  }
});

Deno.serve(app.fetch);