import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar JSON
app.use(express.json());

// Inicializar cliente de OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // la clave se toma de .env
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀 Usa POST /chat para enviar un prompt.");
});

// Ruta para chat
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Falta el campo 'prompt' en el body." });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente médico que responde de forma clara y responsable." },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

