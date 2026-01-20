import React, { useState, useEffect } from 'react';

// --- Iconos Inline (SVG) para no depender de librerías externas ---
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
// ------------------------------------------------------------------

const App = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    date: ''
  });
  const [folio, setFolio] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Inyectar Tailwind CSS automáticamente si no está presente
  // Esto asegura que se vea bien incluso si el proyecto no tiene la configuración completa
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Alfabeto en español incluyendo la Ñ para el cálculo de índices
  const spanishAlphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar errores al escribir
    setFolio(''); // Limpiar folio anterior si cambian datos
    setCopied(false);
  };

  const getLetterNumber = (char) => {
    if (!char) return 0;
    const upperChar = char.toUpperCase();
    // indexOf retorna índice base 0 (A=0), sumamos 1 para que sea base 1 (A=1)
    const index = spanishAlphabet.indexOf(upperChar);
    return index !== -1 ? index + 1 : 0;
  };

  // Helper para obtener partes del nombre de forma consistente (maneja espacios dobles)
  const getNameParts = (fullName) => {
    if (!fullName) return [];
    return fullName.trim().split(/\s+/);
  };

  const generateFolio = (e) => {
    e.preventDefault();
    
    // 1. Validaciones básicas
    if (!formData.fullName.trim() || !formData.date) {
      setError('Por favor completa el nombre y la fecha.');
      return;
    }

    // Dividir el nombre completo usando el helper seguro
    const nameParts = getNameParts(formData.fullName);
    
    if (nameParts.length < 2) {
      setError('Por favor ingresa al menos un nombre y un apellido.');
      return;
    }

    const firstName = nameParts[0];
    const lastName = nameParts[1]; // Tomamos la segunda palabra como primer apellido

    // Validar longitud de nombres para poder extraer la segunda letra
    if (firstName.length < 2 || lastName.length < 2) {
      setError('El nombre y el apellido deben tener al menos 2 letras cada uno.');
      return;
    }

    // 2. Lógica de generación del Folio
    try {
      // Variable 1: Inicial del primer nombre
      const v1 = firstName[0].toUpperCase();

      // Variable 2: Número de la segunda letra del primer nombre (Alfabeto Español)
      const v2 = getLetterNumber(firstName[1]);

      // Variable 3: Primer letra del primer apellido
      const v3 = lastName[0].toUpperCase();

      // Variable 4: Número de la segunda letra del primer apellido (Alfabeto Español)
      const v4 = getLetterNumber(lastName[1]);

      // Variable 5: Día del mes (dos dígitos)
      // Dividimos por guiones: YYYY-MM-DD -> [YYYY, MM, DD]
      // Tomamos el índice 2 que corresponde al día
      const dateParts = formData.date.split('-');
      const v5 = dateParts[2] || '00'; // Fallback por seguridad

      const newFolio = `${v1}${v2}${v3}${v4}${v5}`;
      setFolio(newFolio);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar los datos. Verifica que no haya caracteres especiales.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(folio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Variables para el desglose visual (seguro contra errores de renderizado)
  const namePartsDisplay = getNameParts(formData.fullName);
  const firstNameDisplay = namePartsDisplay[0] || '';
  const lastNameDisplay = namePartsDisplay[1] || '';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Hash className="w-6 h-6" />
            Generador de Folios
          </h1>
          <p className="text-blue-100 mt-2 text-sm">Sistema de identificación automático</p>
        </div>

        <div className="p-8">
          <form onSubmit={generateFolio} className="space-y-5">
            
            {/* Input Nombre */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 ml-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez López"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-slate-400 ml-1">Se usará el primer nombre y la primera palabra del apellido.</p>
            </div>

            {/* Input Fecha */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 ml-1">Fecha de Registro</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Crear Folio
            </button>
          </form>

          {/* Resultado */}
          {folio && (
            <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-center text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">Folio Generado</p>
              <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between shadow-inner">
                <code className="text-2xl font-mono text-green-400 tracking-wider font-bold">
                  {folio}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                  title="Copiar al portapapeles"
                >
                  {copied ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
                </button>
              </div>
              
              <div className="mt-4 text-xs text-slate-400 bg-slate-50 p-3 rounded border border-slate-200">
                <p><strong>Detalles del desglose:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
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
                  <li>Día: {folio.slice(-2)}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;