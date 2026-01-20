import React, { useState } from 'react';
import { User, Calendar, Hash, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    date: ''
  });
  const [folio, setFolio] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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

  const generateFolio = (e) => {
    e.preventDefault();
    
    // 1. Validaciones básicas
    if (!formData.fullName.trim() || !formData.date) {
      setError('Por favor completa el nombre y la fecha.');
      return;
    }

    // Dividir el nombre completo en palabras
    const nameParts = formData.fullName.trim().split(/\s+/);
    
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
      // Usamos la fecha seleccionada por el usuario. El formato es YYYY-MM-DD.
      const v5 = formData.date.split('-')[2];

      const newFolio = `${v1}${v2}${v3}${v4}${v5}`;
      setFolio(newFolio);
    } catch (err) {
      setError('Ocurrió un error al procesar los datos. Verifica que no haya caracteres especiales.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(folio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                  <li>Inicial nombre: {folio.substring(0,1)}</li>
                  <li>Posición 2da letra ({formData.fullName.trim().split(' ')[0][1]?.toUpperCase()}): {getLetterNumber(formData.fullName.trim().split(' ')[0][1])}</li>
                  <li>Inicial apellido: {formData.fullName.trim().split(' ')[1]?.[0]?.toUpperCase()}</li>
                  <li>Posición 2da letra ({formData.fullName.trim().split(' ')[1]?.[1]?.toUpperCase()}): {getLetterNumber(formData.fullName.trim().split(' ')[1]?.[1])}</li>
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