import React, { useState } from 'react';

// --- ESTILOS CSS (Incrustados para garantizar diseño sin dependencias externas) ---
const styles = `
  /* Reset global robusto para evitar desbordamientos */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overflow-x: hidden; /* Evita scroll horizontal y cortes */
    background-color: #f1f5f9; /* Slate 100 */
  }
  
  #root {
    width: 100%;
    min-height: 100vh;
  }

  .app-container {
    width: 100%;
    min-height: 100vh; /* Ocupar toda la altura vertical */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    color: #1e293b; /* Slate 800 */
  }

  .card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 500px;
    overflow: hidden;
    margin: auto; /* Asegura centrado extra */
  }

  .header {
    background-color: #2563eb; /* Blue 600 */
    padding: 1.5rem;
    text-align: center;
    color: white;
  }

  .header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .header p {
    margin: 0.5rem 0 0 0;
    color: #dbeafe; /* Blue 100 */
    font-size: 0.875rem;
  }

  .content {
    padding: 1.5rem; /* Reducido ligeramente para dar más espacio en móviles */
  }

  /* Media query para pantallas más grandes */
  @media (min-width: 640px) {
    .content {
      padding: 2rem;
    }
  }

  .form-group {
    margin-bottom: 1.25rem;
    width: 100%; /* Asegurar que el grupo no exceda el padre */
  }

  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155; /* Slate 700 */
    margin-bottom: 0.25rem;
    margin-left: 0.25rem;
  }

  .input-wrapper {
    position: relative;
    width: 100%; /* Asegurar ancho del contenedor */
  }

  .input-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    padding-left: 0.75rem;
    display: flex;
    align-items: center;
    pointer-events: none;
    color: #94a3b8; /* Slate 400 */
    z-index: 10; /* Asegurar que el ícono esté encima visualmente pero sin bloquear clicks */
  }

  .input {
    display: block; /* Asegura comportamiento de bloque */
    width: 100%;
    max-width: 100%; /* Prevenir desbordamiento */
    box-sizing: border-box; /* Crucial: padding no suma al ancho */
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #cbd5e1; /* Slate 300 */
    border-radius: 0.5rem;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
    background-color: white;
    color: #1e293b; /* Slate 800 - EXPLICITO: Evita texto blanco en modo oscuro */
    appearance: none; /* Normalizar renderizado en iOS/Móviles */
    -webkit-appearance: none;
  }

  .input:focus {
    border-color: #3b82f6; /* Blue 500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .helper-text {
    font-size: 0.75rem;
    color: #94a3b8; /* Slate 400 */
    margin-top: 0.25rem;
    margin-left: 0.25rem;
  }

  .error-box {
    background-color: #fef2f2; /* Red 50 */
    color: #dc2626; /* Red 600 */
    font-size: 0.875rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .btn-primary {
    width: 100%;
    background-color: #2563eb; /* Blue 600 */
    color: white;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1rem;
  }

  .btn-primary:hover {
    background-color: #1d4ed8; /* Blue 700 */
  }

  .result-section {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #f1f5f9;
    animation: fadeIn 0.5s ease-out;
  }

  .result-title {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b; /* Slate 500 */
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .folio-display {
    background-color: #1e293b; /* Slate 800 */
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    width: 100%; /* Asegurar ancho completo */
    box-sizing: border-box;
  }

  .folio-code {
    font-family: monospace;
    font-size: 1.5rem;
    color: #4ade80; /* Green 400 */
    font-weight: 700;
    letter-spacing: 0.05em;
    word-break: break-all; /* Evita que folios muy largos rompan el diseño */
    margin-right: 0.5rem;
  }

  .btn-copy {
    padding: 0.5rem;
    background-color: #334155; /* Slate 700 */
    border: none;
    border-radius: 0.5rem;
    color: #cbd5e1; /* Slate 300 */
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0; /* Evita que el botón se aplaste */
  }

  .btn-copy:hover {
    background-color: #475569; /* Slate 600 */
    color: white;
  }

  .details-box {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #94a3b8; /* Slate 400 */
    background-color: #f8fafc; /* Slate 50 */
    padding: 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid #e2e8f0; /* Slate 200 */
  }

  .details-list {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin: 0.25rem 0 0 0;
  }
  
  .details-list li {
    margin-bottom: 0.125rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// --- Iconos Inline (SVG) ---
const Icon = ({ size = 24, className = "", children }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ display: 'block' }}
  >
    {children}
  </svg>
);

const User = (props) => (
  <Icon {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </Icon>
);

const Calendar = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </Icon>
);

const Hash = (props) => (
  <Icon {...props}>
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </Icon>
);

const Copy = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </Icon>
);

const CheckCircle = (props) => (
  <Icon {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </Icon>
);

const AlertCircle = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </Icon>
);

// --- Componente Principal ---
const App = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    date: ''
  });
  const [folio, setFolio] = useState('');
  const [randomData, setRandomData] = useState({ letter: '', number: '' });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const spanishAlphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setFolio('');
    setCopied(false);
  };

  const getLetterNumber = (char) => {
    if (!char) return 0;
    const upperChar = char.toUpperCase();
    const index = spanishAlphabet.indexOf(upperChar);
    return index !== -1 ? index + 1 : 0;
  };

  const getNameParts = (fullName) => {
    if (!fullName) return [];
    return fullName.trim().split(/\s+/);
  };

  const generateFolio = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.date) {
      setError('Por favor completa el nombre y la fecha.');
      return;
    }
    const nameParts = getNameParts(formData.fullName);
    if (nameParts.length < 2) {
      setError('Por favor ingresa al menos un nombre y un apellido.');
      return;
    }
    const firstName = nameParts[0];
    const lastName = nameParts[1];

    if (firstName.length < 2 || lastName.length < 2) {
      setError('El nombre y el apellido deben tener al menos 2 letras cada uno.');
      return;
    }

    try {
      // Variables originales
      const v1 = firstName[0].toUpperCase();
      const v2 = getLetterNumber(firstName[1]);
      const v3 = lastName[0].toUpperCase();
      const v4 = getLetterNumber(lastName[1]);
      
      const dateParts = formData.date.split('-');
      const v5 = dateParts[2] || '00';

      // --- Nuevas variables ---
      
      // Variable 6: Cantidad de letras del primer nombre
      const v6 = firstName.length;

      // Variable 7: Letra al azar
      const v7 = spanishAlphabet[Math.floor(Math.random() * spanishAlphabet.length)];

      // Variable 8: Número del 1 al 99 al azar
      const v8 = Math.floor(Math.random() * 99) + 1;

      // Generar Folio
      const newFolio = `${v1}${v2}${v3}${v4}${v5}${v6}${v7}${v8}`;
      
      setRandomData({ letter: v7, number: v8 });
      setFolio(newFolio);

    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar los datos.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(folio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const namePartsDisplay = getNameParts(formData.fullName);
  const firstNameDisplay = namePartsDisplay[0] || '';
  const lastNameDisplay = namePartsDisplay[1] || '';

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <div className="card">
          
          {/* Header */}
          <div className="header">
            <h1>
              <Hash size={24} />
              Generador de Folios
            </h1>
            <p>Sistema de identificación automático</p>
          </div>

          <div className="content">
            <form onSubmit={generateFolio}>
              
              {/* Input Nombre */}
              <div className="form-group">
                <label className="label">Nombre Completo</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez López"
                    className="input"
                  />
                </div>
                <p className="helper-text">Se usará el primer nombre y la primera palabra del apellido.</p>
              </div>

              {/* Input Fecha */}
              <div className="form-group">
                <label className="label">Fecha de Registro</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary">
                Crear Folio
              </button>
            </form>

            {/* Resultado */}
            {folio && (
              <div className="result-section">
                <p className="result-title">Folio Generado</p>
                <div className="folio-display">
                  <code className="folio-code">{folio}</code>
                  <button
                    onClick={copyToClipboard}
                    className="btn-copy"
                    title="Copiar al portapapeles"
                  >
                    {copied ? <CheckCircle size={20} style={{color: '#4ade80'}} /> : <Copy size={20} />}
                  </button>
                </div>
                
                <div className="details-box">
                  <p><strong>Detalles del desglose:</strong></p>
                  <ul className="details-list">
                    <li>Inicial nombre: {firstNameDisplay[0]?.toUpperCase()}</li>
                    <li>
                      Posición 2da letra ({firstNameDisplay[1]?.toUpperCase() || '-'}): 
                      {' '}{getLetterNumber(firstNameDisplay[1])}
                    </li>
                    <li>Inicial apellido: {lastNameDisplay[0]?.toUpperCase()}</li>
                    <li>
                      Posición 2da letra ({lastNameDisplay[1]?.toUpperCase() || '-'}): 
                      {' '}{getLetterNumber(lastNameDisplay[1])}
                    </li>
                    <li>Día: {formData.date.split('-')[2] || '00'}</li>
                    <li>Largo nombre ({firstNameDisplay}): {firstNameDisplay.length}</li>
                    <li>Letra aleatoria: {randomData.letter}</li>
                    <li>Número aleatorio: {randomData.number}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
