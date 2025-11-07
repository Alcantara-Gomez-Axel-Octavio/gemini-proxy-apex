const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

// Configura la API key de Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usa un modelo que sí exista en v1beta
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('¡El proxy de Gemini (Render) está vivo y listo!');
});

// Endpoint de estado
app.get('/status', (req, res) => {
  res.json({ status: 'ok', message: 'Gemini proxy activo y listo' });
});

// Endpoint principal
app.post('/llamar-a-gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Falta el "prompt"' });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ respuesta: text });
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    res.status(500).json({ error: 'Error interno del servidor proxy', details: error.message });
  }
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

