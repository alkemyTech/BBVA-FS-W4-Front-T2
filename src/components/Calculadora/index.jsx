import React, { useState, useEffect } from 'react';
import { FaBackspace } from 'react-icons/fa';
import FunctionsIcon from '@mui/icons-material/Functions';
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import './calculadora.css'; // Asegúrate de importar tu archivo CSS
import CurrencyConverter from "../Converter"; // Importa el componente de conversor de moneda

const buttons = [
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: 'backspace', type: 'action' },
  { label: '4', type: 'number' },
  { label: '5', type: 'number' },
  { label: '6', type: 'number' },
  { label: '*', type: 'operator' },
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '-', type: 'operator' },
  { label: '0', type: 'number' },
  { label: '.', type: 'number' },
  { label: '/', type: 'operator' },
  { label: '+', type: 'operator' },
  { label: 'AC', type: 'action' },
  { label: '=', type: 'action' }
];
const Calculadora = () => {
  const [input, setInput] = useState('');
  const [showCalculator, setShowCalculator] = useState(false); // Estado para controlar si mostrar la calculadora estándar
  const [showConverter, setShowConverter] = useState(false); // Estado para controlar si mostrar el conversor de moneda
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/\d/.test(key) || key === '.' || key === '*' || key === '-' || key === '/' || key === '+') {
        // Permitir solo dígitos, operadores y el punto decimal
        handleButtonClick(key);
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Enter') {
        handleCalculate();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]); // Escuchar cambios en 'input' para evitar múltiples asignaciones
  
  const handleButtonClick = (value) => {
    if (value === 'backspace') {
      handleBackspace();
    } else if (value === 'AC') {
      handleClear();
    } else if (value === '=') {
      handleCalculate();
    } else {
      setInput(input + value);
    }
  };
  const handleClear = () => {
    setInput('');
  };
  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };
  const handleCalculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };
  const toggleCalculator = () => {
    setShowCalculator(!showCalculator); // Alternar entre mostrar y ocultar la calculadora estándar
    setShowConverter(false); // Asegurar que el conversor de moneda esté oculto al mostrar la calculadora
  };
  const toggleConverter = () => {
    setShowConverter(!showConverter); // Alternar entre mostrar y ocultar el conversor de moneda
    setShowCalculator(false); // Asegurar que la calculadora estándar esté oculta al mostrar el conversor de moneda
  };

  const toggleViews = () => {
    if (showCalculator) {
      toggleConverter();
    } else if (showConverter) {
      toggleCalculator();
    } else {
      toggleCalculator(); // Por defecto mostrar la calculadora en el primer clic
    }
  };
  // Determinar qué icono mostrar en función del estado
  const getIcon = () => {
    if (showConverter) {
      return <CurrencyExchangeIcon style={{ fontSize: '36px' }} />;
    } else {
      return <FunctionsIcon style={{ fontSize: '36px' }} />;
    }
  };

  return (
    <div className={`calculator-container ${showCalculator  ? 'expanded' : ''}`}>
      <div className="calculator">
        {showCalculator  && (
          <div className="calculator-content">
            <button className="close-button" onClick={toggleCalculator}>
              &times;
            </button>
            <div className="calculator-display">
              <span className="input-text">{input || '0'}</span>
            </div>
            <div className="calculator-grid">
              {buttons.map((button) => (
                <button
                  key={button.label}
                  className={`calculator-button ${button.type === 'operator' ? 'operator' : ''} ${button.label === '=' ? 'equal' : ''} ${button.label === 'AC' || button.label === 'backspace' ? 'clear backspace' : ''} ${button.type === 'number' ? 'number' : ''}`}
                  onClick={() => handleButtonClick(button.label)}
                >
                  {button.label === 'backspace' ? <FaBackspace /> : button.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {showConverter && <CurrencyConverter />} {/* Mostrar el conversor de moneda si showConverter es true */}
        <div className="calculator-bubble" onClick={toggleViews}>
        {getIcon()}
        </div>
      </div>
    </div>
  );
};
export default Calculadora;
