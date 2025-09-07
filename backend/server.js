import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 4000;

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

app.get("/symbols", (req, res) => {
  res.json({ symbols: fallbackSymbols });
});

// Rota de conversão usando AwesomeAPI com chave
app.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount)
    return res
      .status(400)
      .json({ message: "from, to e amount são obrigatórios" });

  try {
    const pair = `${from.toUpperCase()}-${to.toUpperCase()}`;

    const response = await axios.get(
      `https://economia.awesomeapi.com.br/last/${pair}`,
      {
        params: { api_key: process.env.API_KEY }, // adiciona a chave aqui
      }
    );

    const key = pair.replace("-", ""); // ex: USD-BRL → USDBRL
    const rate = parseFloat(response.data[key].bid);
    const result = parseFloat(amount) * rate;

    res.json({ result });
  } catch (err) {
    console.error("Erro em /convert:", err.message);
    res.status(500).json({ message: "Erro ao converter moedas" });
  }
});

app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
