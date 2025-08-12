@@ .. @@
 import express from "express";
 import fetch from "node-fetch";
 import dotenv from "dotenv";
 import cors from "cors";
 import multer from "multer";
 import fs from "fs";
+import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
 
 dotenv.config();
 const app = express();
 app.use(cors());
 app.use(express.json());
 
 // --------------------- MULTER SETUP FOR IMAGE UPLOAD (OPTIONAL) ---------------------
 const upload = multer({ dest: "uploads/" });
 
 // --------------------- HEALTH CHECK ---------------------
 app.get("/health", (req, res) => {
   res.json({ status: "ok" });
 });
 
+// --------------------- AI CAPTION GENERATION ---------------------
+app.post("/generate-captions", ClerkExpressRequireAuth(), async (req, res) => {
+  const { prompt, vibe } = req.body;
+
+  if (!prompt) {
+    return res.status(400).json({ error: "Prompt is required" });
+  }
+
+  try {
+    // Create a more specific prompt based on vibe
+    const vibePrompts = {
+      funny: `Generate 5 funny and humorous meme captions about "${prompt}". Make them witty and entertaining.`,
+      sarcastic: `Generate 5 sarcastic and witty meme captions about "${prompt}". Use irony and clever wordplay.`,
+      relatable: `Generate 5 relatable meme captions about "${prompt}" that people can connect with in their daily lives.`,
+      motivational: `Generate 5 motivational and inspiring meme captions about "${prompt}". Make them uplifting and positive.`,
+      parody: `Generate 5 parody meme captions about "${prompt}". Make them playful and reference popular culture.`,
+      savage: `Generate 5 savage and bold meme captions about "${prompt}". Make them edgy but not offensive.`,
+      wholesome: `Generate 5 wholesome and heartwarming meme captions about "${prompt}". Keep them family-friendly.`,
+      cringe: `Generate 5 intentionally cringe-worthy meme captions about "${prompt}". Make them awkwardly funny.`
+    };
+
+    const fullPrompt = vibePrompts[vibe] || vibePrompts.funny;
+    
+    // For now, we'll use a simple text generation approach
+    // You can replace this with actual AI text generation API calls
+    const mockCaptions = generateMockCaptions(prompt, vibe);
+    
+    res.json({ captions: mockCaptions });
+  } catch (err) {
+    console.error("Error generating captions:", err);
+    res.status(500).json({ error: "Caption generation failed" });
+  }
+});
+
+// Mock caption generator (replace with actual AI service)
+function generateMockCaptions(prompt, vibe) {
+  const templates = {
+    funny: [
+      `When ${prompt} hits different`,
+      `Me trying to understand ${prompt}`,
+      `${prompt}: exists | My brain: it's free real estate`,
+      `Nobody: | Absolutely nobody: | Me with ${prompt}:`,
+      `${prompt} be like: "Am I a joke to you?"`
+    ],
+    sarcastic: [
+      `Oh great, another ${prompt} situation`,
+      `${prompt}? How original...`,
+      `Wow, ${prompt} is exactly what I needed today`,
+      `Let me guess... ${prompt} again?`,
+      `${prompt}: Because life wasn't complicated enough`
+    ],
+    relatable: [
+      `When you realize ${prompt} is your life`,
+      `Me every time ${prompt} happens`,
+      `${prompt}: The story of my life`,
+      `Why is ${prompt} so accurate?`,
+      `${prompt} hits too close to home`
+    ],
+    motivational: [
+      `${prompt} can't stop your greatness`,
+      `Turn your ${prompt} into your superpower`,
+      `${prompt} is just a stepping stone`,
+      `You're stronger than any ${prompt}`,
+      `${prompt} today, success tomorrow`
+    ],
+    parody: [
+      `${prompt}: Infinity War | Me: Endgame`,
+      `${prompt} walking into 2025 like...`,
+      `Plot twist: ${prompt} was the main character`,
+      `${prompt}: The sequel nobody asked for`,
+      `When ${prompt} becomes a Netflix series`
+    ],
+    savage: [
+      `${prompt} said what now?`,
+      `${prompt} really thought they did something`,
+      `Imagine thinking ${prompt} was a good idea`,
+      `${prompt} woke up and chose violence`,
+      `${prompt}: The audacity is unmatched`
+    ],
+    wholesome: [
+      `${prompt} makes everything better`,
+      `Grateful for ${prompt} in my life`,
+      `${prompt}: A blessing in disguise`,
+      `${prompt} brings out the best in people`,
+      `Life is beautiful because of ${prompt}`
+    ],
+    cringe: [
+      `${prompt} is so random XD`,
+      `OMG ${prompt} is literally me!!!`,
+      `${prompt} hits different when you're built different`,
+      `${prompt} is giving main character energy`,
+      `Not me relating to ${prompt} on a spiritual level`
+    ]
+  };
+
+  return templates[vibe] || templates.funny;
+}
+
 // --------------------- IMAGE GENERATION (AI) ---------------------
-app.post("/generate-image", async (req, res) => {
+app.post("/generate-image", ClerkExpressRequireAuth(), async (req, res) => {
   const { prompt } = req.body;
 
   if (!prompt) {
     return res.status(400).json({ error: "Prompt is required" });
   }
 
   try {
     const response = await fetch(
       "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
       {
         method: "POST",
         headers: {
           Authorization: `Bearer ${process.env.HF_API_KEY}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ inputs: prompt }),
       }
     );
 
     if (!response.ok) {
       const errorText = await response.text();
       throw new Error(errorText);
     }
 
     const buffer = await response.arrayBuffer();
     const base64Image = Buffer.from(buffer).toString("base64");
     const imageUrl = `data:image/png;base64,${base64Image}`;
 
     res.json({ image: imageUrl });
   } catch (err) {
     console.error("Error generating image:", err);
     res.status(500).json({ error: "Image generation failed" });
   }
 });