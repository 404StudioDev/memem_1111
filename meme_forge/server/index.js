import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";

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

// --------------------- IMAGE GENERATION (AI) ---------------------
app.post("/generate-image", async (req, res) => {
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

// --------------------- START SERVER ---------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
