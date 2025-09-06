import { useState, useEffect, useRef } from "react";

// Estilos CSS com a máxima especificidade e proteção contra estilos globais
const styles = `
/* Estilos do conversor de moeda com alta especificidade */
#currency-converter-component.currency-converter-root {
  all: initial !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif !important;
  --primary: #4a90e2;
  --secondary: #50e3c2;
  --bg-light: #f5f5f5;
  --card-bg: #ffffff;
  --text-main: #333333;
  --text-secondary: #666666;
  --border-radius: 12px;
  
  /* Layout fixo para contornar o flex do body */
  position: relative !important;
  display: block !important;
  width: 100% !important;
  min-height: 50vh !important;
  padding: 20px !important;
  background-color: var(--bg-light) !important;
  color: var(--text-main) !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  isolation: isolate !important;
}

#currency-converter-component.currency-converter-root * {
  all: unset !important;
  box-sizing: border-box !important;
  font-family: inherit !important;
}

#currency-converter-component.currency-converter-root .currency-converter-inner {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-height: 50vh !important;
  width: 100% !important;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  #currency-converter-component.currency-converter-root {
    --bg-light: #1e1e1e !important;
    --card-bg: #2c2c2c !important;
    --text-main: #ffffff !important;
    --text-secondary: #cccccc !important;
  }
}

#currency-converter-component.currency-converter-root .currency-converter-card {
  width: 100% !important;
  max-width: 450px !important;
  padding: 32px !important;
  border-radius: var(--border-radius) !important;
  background-color: var(--card-bg) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 20px !important;
}

#currency-converter-component.currency-converter-root .currency-converter-title {
  margin: 0 !important;
  color: var(--primary) !important;
  font-size: 2.2rem !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}

#currency-converter-component.currency-converter-root .currency-converter-input {
  width: 100% !important;
  padding: 16px !important;
  font-size: 18px !important;
  border: 2px solid var(--secondary) !important;
  border-radius: var(--border-radius) !important;
  background-color: var(--card-bg) !important;
  color: var(--text-main) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-input:focus {
  outline: none !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-selects-container {
  display: flex !important;
  gap: 12px !important;
  width: 100% !important;
}

#currency-converter-component.currency-converter-root .currency-converter-selects-container > div {
  flex: 1 !important;
}

#currency-converter-component.currency-converter-root .currency-converter-button {
  width: 100% !important;
  padding: 16px !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  background-color: var(--primary) !important;
  color: white !important;
  border: none !important;
  border-radius: var(--border-radius) !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

#currency-converter-component.currency-converter-root .currency-converter-button:hover:not(:disabled) {
  background-color: var(--secondary) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(80, 227, 194, 0.3) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-button:focus {
  outline: 4px auto -webkit-focus-ring-color !important;
}

#currency-converter-component.currency-converter-root .currency-converter-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

#currency-converter-component.currency-converter-root .currency-converter-result-container {
  padding: 20px !important;
  background-color: var(--bg-light) !important;
  border-radius: var(--border-radius) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-result-container h3 {
  margin: 0 0 12px 0 !important;
  color: var(--text-secondary) !important;
  font-size: 1.1rem !important;
}

#currency-converter-component.currency-converter-root .currency-converter-result-text {
  font-size: 1.4rem !important;
  margin: 0 !important;
  color: var(--text-main) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-result-text strong {
  color: var(--primary) !important;
  font-weight: 700 !important;
}

#currency-converter-component.currency-converter-root .currency-converter-result-placeholder {
  color: var(--text-secondary) !important;
  font-style: italic !important;
  margin: 0 !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-container {
  position: relative !important;
  width: 100% !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-trigger {
  width: 100% !important;
  padding: 12px 16px !important;
  border: 2px solid var(--secondary) !important;
  border-radius: var(--border-radius) !important;
  cursor: pointer !important;
  background-color: var(--card-bg) !important;
  color: var(--text-main) !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  font-weight: 500 !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-trigger:hover {
  border-color: var(--primary) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-trigger:focus {
  outline: 4px auto -webkit-focus-ring-color !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-dropdown {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  right: 0 !important;
  max-height: 200px !important;
  overflow-y: auto !important;
  border: 2px solid var(--secondary) !important;
  border-radius: var(--border-radius) !important;
  background-color: var(--card-bg) !important;
  z-index: 1000 !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  margin-top: 2px !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-option {
  padding: 12px 16px !important;
  cursor: pointer !important;
  border-bottom: 1px solid var(--bg-light) !important;
  font-size: 14px !important;
  transition: background-color 0.2s ease !important;
  color: var(--text-main) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-option:hover {
  background-color: var(--bg-light) !important;
}

#currency-converter-component.currency-converter-root .currency-converter-custom-select-option:last-child {
  border-bottom: none !important;
}

#currency-converter-component.currency-converter-root .currency-converter-no-wrap {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* Responsive */
@media (max-width: 480px) {
  #currency-converter-component.currency-converter-root {
    padding: 16px !important;
  }

  #currency-converter-component.currency-converter-root .currency-converter-card {
    padding: 24px !important;
    gap: 16px !important;
  }

  #currency-converter-component.currency-converter-root .currency-converter-selects-container {
    flex-direction: column !important;
  }

  #currency-converter-component.currency-converter-root .currency-converter-title {
    font-size: 1.8rem !important;
  }

  #currency-converter-component.currency-converter-root .currency-converter-input,
  #currency-converter-component.currency-converter-root .currency-converter-button {
    font-size: 16px !important;
    padding: 14px !important;
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
      className="currency-converter-input"
      min="0"
      step="0.01"
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
    <div
      ref={containerRef}
      className="currency-converter-custom-select-container"
    >
      <div
        className="currency-converter-custom-select-trigger"
        onClick={() => setOpen(!open)}
      >
        <span className="currency-converter-no-wrap">
          {value || "Selecione"}
        </span>
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
        <div className="currency-converter-custom-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className="currency-converter-custom-select-option currency-converter-no-wrap"
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
    <button
      onClick={onClick}
      disabled={disabled}
      className="currency-converter-button"
    >
      {children}
    </button>
  );
}

// Componente Result
function Result({ amount, from, to, value }) {
  return (
    <div className="currency-converter-result-container">
      <h3>Resultado</h3>
      {value !== null ? (
        <p className="currency-converter-result-text">
          {amount} <strong>{from}</strong> ={" "}
          <strong>
            {value} {to}
          </strong>
        </p>
      ) : (
        <p className="currency-converter-result-placeholder">
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

  const API_KEY = import.meta.env.VITE_EXCHANGE_KEY;

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
      <div
        id="currency-converter-component"
        className="currency-converter-root"
        style={{
          // Estilos inline como fallback absoluto
          all: "initial",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
          backgroundColor: "#f5f5f5",
          color: "#333333",
          padding: "20px",
          minHeight: "50vh",
          display: "block",
          width: "100%",
          margin: "0",
          boxSizing: "border-box",
          isolation: "isolate",
          position: "relative",
        }}
      >
        <div
          className="currency-converter-inner"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            width: "100%",
          }}
        >
          <div
            className="currency-converter-card"
            style={{
              width: "100%",
              maxWidth: "450px",
              padding: "32px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h1
              className="currency-converter-title"
              style={{
                margin: "0",
                color: "#4a90e2",
                fontSize: "2.2rem",
                fontWeight: "700",
              }}
            >
              ExRate 💱
            </h1>

            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Valor"
            />

            <div className="currency-converter-selects-container">
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
        </div>
      </div>
    </>
  );
}

export default CurrencyConverter;
