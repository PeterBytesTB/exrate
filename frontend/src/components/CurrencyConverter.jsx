import { useState, useEffect, useRef } from "react";

// Estilos CSS incorporados
const styles = `
:root {
  --primary: #4a90e2;
  --secondary: #50e3c2;
  --bg-light: #f5f5f5;
  --card-bg: #ffffff;
  --text-main: #333333;
  --text-secondary: #666666;
  --border-radius: 12px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-light: #1e1e1e;
    --card-bg: #2c2c2c;
    --text-main: #ffffff;
    --text-secondary: #cccccc;
  }
}

* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  background-color: var(--bg-light);
  color: var(--text-main);
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 450px;
  padding: 32px;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  margin: 0;
  color: var(--primary);
  font-size: 2.2rem;
  font-weight: 700;
}

.currency-input {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  border: 2px solid var(--secondary);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  color: var(--text-main);
}

.currency-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.selects-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

.selects-container > div {
  flex: 1;
}

.convert-button {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.convert-button:hover:not(:disabled) {
  background-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 227, 194, 0.3);
}

.convert-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-container {
  padding: 20px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.result-container h3 {
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.result-text {
  font-size: 1.4rem;
  margin: 0;
  color: var(--text-main);
}

.result-text strong {
  color: var(--primary);
  font-weight: 700;
}

.result-placeholder {
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}

.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--secondary);
  border-radius: var(--border-radius);
  cursor: pointer;
  background-color: var(--card-bg);
  color: var(--text-main);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.custom-select-trigger:hover {
  border-color: var(--primary);
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 2px solid var(--secondary);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 2px;
}

.custom-select-option {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--bg-light);
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.custom-select-option:hover {
  background-color: var(--bg-light);
}

.custom-select-option:last-child {
  border-bottom: none;
}

.no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  body {
    padding: 16px;
  }

  .card {
    padding: 24px;
    gap: 16px;
  }

  .selects-container {
    flex-direction: column;
  }

  h1 {
    font-size: 1.8rem;
  }

  .currency-input,
  .convert-button {
    font-size: 16px;
    padding: 14px;
  }
}
`;

// Componente Input
function Input({ type, value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="currency-input"
    />
  );
}

// Componente Select
function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="custom-select-container">
      <div className="custom-select-trigger" onClick={() => setOpen(!open)}>
        <span className="no-wrap">{value || "Selecione"}</span>
        <span
          style={{
            fontSize: "10px",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="custom-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className="custom-select-option no-wrap"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente Button
function Button({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} className="convert-button">
      {children}
    </button>
  );
}

// Componente Result
function Result({ amount, from, to, value }) {
  return (
    <div className="result-container">
      <h3>Resultado</h3>
      {value !== null ? (
        <p className="result-text">
          {amount} <strong>{from}</strong> ={" "}
          <strong>
            {value} {to}
          </strong>
        </p>
      ) : (
        <p className="result-placeholder">
          Clique em "Converter" para ver o resultado
        </p>
      )}
    </div>
  );
}

// Componente principal CurrencyConverter
function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.exchangerate.host/symbols")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.symbols) {
          const symbols = Object.keys(data.symbols).sort();
          setCurrencies(symbols);

          if (!symbols.includes(fromCurrency)) setFromCurrency(symbols[0]);
          if (!symbols.includes(toCurrency)) setToCurrency(symbols[0]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar moedas:", err);
        // Fallback com algumas moedas populares
        const fallbackCurrencies = [
          "USD",
          "BRL",
          "EUR",
          "GBP",
          "JPY",
          "CAD",
          "AUD",
          "CHF",
          "CNY",
          "ARS",
        ];
        setCurrencies(fallbackCurrencies);
      });
  }, []);

  const API_KEY = import.meta.env.VITE_EXCHANGE_KEY; // ✅ variável de ambiente Vite

  const convert = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    setLoading(true);
    setResult(null);

    try {
      const url = `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amt}${
        API_KEY ? `&access_key=${API_KEY}` : ""
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && typeof data.result === "number") {
        setResult(data.result.toFixed(2));
      } else {
        setResult("Erro na conversão");
      }
    } catch (err) {
      console.error("Erro na conversão:", err);
      setResult("Erro na conversão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="card">
        <h1>ExRate 💱</h1>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Valor"
        />

        <div className="selects-container">
          <Select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            options={currencies}
          />
          <Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            options={currencies}
          />
        </div>

        <Button onClick={convert} disabled={loading}>
          {loading ? "Convertendo..." : "Converter"}
        </Button>

        <Result
          amount={amount}
          from={fromCurrency}
          to={toCurrency}
          value={result}
        />
      </div>
    </>
  );
}

export default CurrencyConverter;
