import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de conversão
app.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ message: "Parâmetros obrigatórios: from, to, amount" });
  }

  try {
    const response = await axios.get("https://api.exchangerate.host/convert", {
      params: { from, to, amount },
    });

    res.json({
      result: response.data.result,
      query: response.data.query,
      info: response.data.info,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao converter moedas" });
  }
});

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
