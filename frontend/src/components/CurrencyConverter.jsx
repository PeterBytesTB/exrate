import { useState, useEffect, useCallback, useRef, memo } from "react";

// CSS isolado para ExRate
const styles = `
#currency-converter-component {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
  --primary: #4a90e2;
  --secondary: #50e3c2;
  --bg-light: #f5f5f5;
  --card-bg: #ffffff;
  --text-main: #333333;
  --text-secondary: #666666;
  --border-radius: 12px;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 480px;
  padding: 20px;
  background-color: var(--bg-light);
  color: var(--text-main);
  margin: 0;
  box-sizing: border-box;
  isolation: isolate;
  z-index: 9999;
}

#currency-converter-component * {
  box-sizing: border-box;
  font-family: inherit;
}

.currency-converter-card {
  width: 100%;
  padding: 32px;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.currency-converter-title {
  margin: 0;
  color: var(--primary);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
}

.currency-converter-input {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  border: 2px solid var(--secondary);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  color: var(--text-main);
}

.currency-converter-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74,144,226,0.1);
}

.currency-converter-selects-container {
  display: flex;
  gap: 12px;
  width: 100%;
}

.currency-converter-selects-container > div {
  flex: 1;
}

.currency-converter-button {
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

.currency-converter-button:hover:not(:disabled) {
  background-color: var(--secondary);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80,227,194,0.3);
}

.currency-converter-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.currency-converter-result-container {
  padding: 20px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.currency-converter-result-text strong {
  color: var(--primary);
  font-weight: 700;
}

.currency-converter-result-placeholder {
  color: var(--text-secondary);
  font-style: italic;
}

/* Custom Select */
.currency-converter-custom-select-container {
  position: relative;
  width: 100%;
}

.currency-converter-custom-select-trigger {
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

.currency-converter-custom-select-trigger:hover {
  border-color: var(--primary);
}

.currency-converter-custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 200px; /* altura fixa */
  max-height: 200px;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid var(--secondary);
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  z-index: 2000;
}

.currency-converter-custom-select-container.open .currency-converter-custom-select-dropdown {
  opacity: 1;
  transform: translateY(0);
}

.currency-converter-custom-select-option {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--bg-light);
  font-size: 14px;
  color: var(--text-main); /* texto visível */
  transition: background-color 0.2s ease;
}

.currency-converter-custom-select-option:hover {
  background-color: rgba(74,144,226,0.1);
}

.currency-converter-custom-select-option:last-child {
  border-bottom: none;
}

.currency-converter-no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  #currency-converter-component {
    --bg-light: #1e1e1e;
    --card-bg: #2c2c2c;
    --text-main: #ffffff;
    --text-secondary: #cccccc;
  }

  .currency-converter-custom-select-option {
    color: var(--text-main);
  }
}

/* Responsivo */
@media (max-width: 480px) {
  #currency-converter-component {
    padding: 16px;
  }

  .currency-converter-card {
    padding: 24px;
    gap: 16px;
  }

  .currency-converter-selects-container {
    flex-direction: column;
  }

  .currency-converter-title {
    font-size: 1.8rem;
  }

  .currency-converter-input,
  .currency-converter-button {
    font-size: 16px;
    padding: 14px;
  }
}
`;

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carregar moedas
  useEffect(() => {
    fetch("http://localhost:4000/symbols")
      .then((res) => res.json())
      .then((data) => {
        const symbols = data?.symbols?.sort() || [
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
        setCurrencies(symbols);
        if (!fromCurrency) setFromCurrency("USD");
        if (!toCurrency) setToCurrency("BRL");
      })
      .catch(() => {
        const fallback = [
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
        setCurrencies(fallback);
        if (!fromCurrency) setFromCurrency(fallback[0]);
        if (!toCurrency) setToCurrency(fallback[1]);
      });
  }, []);

  // Conversão
  const convert = useCallback(async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    setLoading(true);
    setResult(null);

    try {
      const url = `http://localhost:4000/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amt}`;
      const data = await (await fetch(url)).json();

      if (typeof data.result === "number") {
        setResult(Number(data.result).toFixed(2));
      } else {
        setResult("Não foi possível converter");
      }
    } catch {
      setResult("Não foi possível converter");
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Input memoizado
  const Input = memo(({ value, onChange }) => (
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder="Valor"
      className="currency-converter-input"
      min="0"
      step="0.01"
    />
  ));

  // Select otimizado e memoizado
  const Select = memo(({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const handleClickOutside = useCallback((e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }, []);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleSelect = useCallback(
      (val) => {
        onChange({ target: { value: val } });
        setOpen(false);
      },
      [onChange]
    );

    const disabled = options.length === 0;

    return (
      <div
        ref={ref}
        className={`currency-converter-custom-select-container ${
          open ? "open" : ""
        }`}
      >
        <div
          className="currency-converter-custom-select-trigger"
          onClick={() => !disabled && setOpen(!open)}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        >
          <span className="currency-converter-no-wrap">
            {value || (disabled ? "Carregando..." : "Selecione")}
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

        {options.length > 0 && open && (
          <div
            className="currency-converter-custom-select-dropdown"
            style={{ height: "200px" }}
          >
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
  });

  // Button memoizado
  const Button = memo(({ onClick, disabled, children }) => (
    <button
      className="currency-converter-button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ));

  // Result memoizado
  const Result = memo(({ amount, from, to, value }) => (
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
  ));

  return (
    <>
      <style>{styles}</style>
      <div id="currency-converter-component">
        <div className="currency-converter-card">
          <h1 className="currency-converter-title">ExRate 💱</h1>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
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
          <Button
            onClick={convert}
            disabled={loading || currencies.length === 0}
          >
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
    </>
  );
}
