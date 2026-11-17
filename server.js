import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Servidor API - No Llegues Tarde</title>
        <meta http-equiv="refresh" content="2; url=http://localhost:8081" />
        <style>
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white; text-align: center; }
          .card { background: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 500px; border: 1px solid #334155; }
          h2 { margin-top: 0; color: #38bdf8; }
          p { color: #94a3b8; line-height: 1.6; }
          a { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #0284c7; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🚍 Servidor API Activo</h2>
          <p>La aplicación interactiva de transporte se encuentra en el puerto <strong>8081</strong>.</p>
          <p>Redirigiendo automáticamente a la app...</p>
          <a href="http://localhost:8081">Abrir Aplicación en http://localhost:8081</a>
        </div>
      </body>
    </html>
  `);
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor de Anthropic funcionando correctamente 🚀",
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Debes enviar un mensaje.",
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text = response.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");

    res.json({
      success: true,
      response: text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});