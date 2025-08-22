// server.js
// 1) Dependencias
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Necesario para obtener __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2) Configuración OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 3) Endpoint del chat
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // rápido y barato
      messages: [
        { role: "system", content: "Eres DoctorIA, un asistente de orientación general en salud. No das diagnósticos médicos." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error en el servidor. Inténtalo más tarde." });
  }
});

// 4) Servir archivos estáticos (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 5) Arrancar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
