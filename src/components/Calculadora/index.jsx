import React, { useState } from 'react';
import { FaBackspace } from 'react-icons/fa';
import './calculadora.css'; // Asegúrate de importar tu archivo CSS
import FunctionsIcon from '@mui/icons-material/Functions';

const buttons = [
  { label: '7', type: 'number' },
  { label: '8', type: 'number' },
  { label: '9', type: 'number' },
  { label: 'backspace', type: 'action' },
  { label: '4', type: 'number' },
  { label: '5', type: 'number' },
  { label: '6', type: 'number' },
  { label: '*', type: 'operator', fontSize: '1.5rem' },
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '3', type: 'number' },
  { label: '-', type: 'operator', fontSize: '1.5rem' },
  { label: '0', type: 'number' },
  { label: '.', type: 'number', fontSize: '1.5rem' },
  { label: '=', type: 'action', fontSize: '1.5rem' },
  { label: '+', type: 'operator', fontSize: '1.5rem' },
  { label: 'Clear', type: 'action' },
  { label: '/', type: 'operator', fontSize: '1.5rem' }
];

const Calculadora = () => {
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  const toggleCalculator = () => {
    setExpanded(!expanded);
  };

  const handleButtonClick = (value) => {
    if (value === 'backspace') {
      handleBackspace();
    } else if (value === 'Clear') {
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
    <div className={`calculator-container ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(false)}>
      <div className="calculator" onClick={(e) => e.stopPropagation()}>
        {!expanded && <div className="calculator-bubble" onClick={toggleCalculator}><FunctionsIcon  style={{ fontSize: '36px' }} /></div>}
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
                  className={`calculator-button ${button.type === 'operator' ? 'operator' : ''} ${button.label === '=' ? 'equal' : ''} ${button.label === 'Clear' || button.label === 'backspace' ? 'clear backspace' : ''} ${button.type === 'number' ? 'number' : ''}`}
                  onClick={() => handleButtonClick(button.label)}
                >
                  {button.label === 'backspace' ? <FaBackspace /> : button.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculadora;
