import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4000;

// Para __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Lista fixa de moedas (fallback)
const fallbackSymbols = [
  "USD",
  "EUR",
  "BRL",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "ARS",
];

// Rota para listar moedas
app.get("/symbols", (req, res) => {
  res.json({ symbols: fallbackSymbols });
});

// Rota de conversão usando AwesomeAPI
app.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount)
    return res
      .status(400)
      .json({ message: "from, to e amount são obrigatórios" });

  try {
    const pair = `${from.toUpperCase()}-${to.toUpperCase()}`;
    const apiKey = process.env.API_KEY || ""; // sua chave da AwesomeAPI
    const response = await axios.get(
      `https://economia.awesomeapi.com.br/last/${pair}`,
      { params: apiKey ? { api_key: apiKey } : {} }
    );

    const dataKey = pair.replace("-", ""); // ex: USD-BRL → USDBRL
    const bid = response.data[dataKey]?.bid;

    if (!bid) {
      return res
        .status(500)
        .json({ message: "Erro ao obter taxa de câmbio da API" });
    }

    const rate = parseFloat(bid);
    const result = parseFloat(amount) * rate;

    res.json({ result });
  } catch (err) {
    console.error("Erro em /convert:", err.message);
    res.status(500).json({ message: "Erro ao converter moedas" });
  }
});

// Caminho absoluto para a build do front
const frontPath = path.join(__dirname, "frontend", "dist"); // ou "build" se CRA
app.use(express.static(frontPath));

// SPA fallback: qualquer rota não reconhecida retorna index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontPath, "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
