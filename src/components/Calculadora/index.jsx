import React, { useState, useEffect } from 'react';
import { FaBackspace } from 'react-icons/fa';
import FunctionsIcon from '@mui/icons-material/Functions';
import './calculadora.css'; // Asegúrate de importar tu archivo CSS
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
  const [expanded, setExpanded] = useState(false);
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
  const toggleCalculator = () => {
    setExpanded(!expanded);
  };
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
  return (
    <div className={`calculator-container ${expanded ? 'expanded' : ''}`}>
      <div className="calculator">
        {expanded && (
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
        <div className="calculator-bubble" onClick={toggleCalculator}>
          <FunctionsIcon style={{ fontSize: '36px' }} />
        </div>
      </div>
    </div>
  );
};
export default Calculadora;