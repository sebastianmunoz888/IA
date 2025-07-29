// src/APIDebug.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';

export default function APIDebugChecker() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [envStatus, setEnvStatus] = useState({});

  useEffect(() => {
    // Verificación de variables de entorno REAL
    const checkEnvVars = () => {
      const mockKey = import.meta.env?.VITE_OPENROUTER_API_KEY || '';
      
      setEnvStatus({
        hasVitePrefix: true, // Ya tiene el prefijo correcto
        keyLength: mockKey.length,
        isProduction: window.location.hostname !== 'localhost',
        keyPreview: mockKey ? `${mockKey.slice(0, 8)}...${mockKey.slice(-4)}` : 'No encontrada',
        fullKey: mockKey // Para debug
      });
    };

    checkEnvVars();
  }, []);

  const testAPIConnection = async () => {
    const testKey = apiKey.trim() || import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!testKey) {
      setTestResult({
        success: false,
        message: 'No hay API key para probar (ni ingresada ni en variables de entorno)'
      });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${testKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: '✅ API Key válida y funcionando correctamente'
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestResult({
          success: false,
          message: `❌ Error ${response.status}: ${errorData.error?.message || 'API Key inválida'}`
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Error de conexión: ${error.message}`
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="text-red-500" />
          Diagnóstico de API Key - OpenRouter
        </h2>

        {/* Status de Variables de Entorno */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Estado Actual en Producción</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="font-medium">Variable Configurada:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                envStatus.keyLength > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {envStatus.keyLength > 0 ? '✅ Sí' : '❌ No'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="font-medium">Longitud:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                envStatus.keyLength > 30 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {envStatus.keyLength || 0} caracteres
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="font-medium">Entorno:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                envStatus.isProduction ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {envStatus.isProduction ? 'Producción (Render)' : 'Desarrollo'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <span className="font-medium">Preview:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {envStatus.keyPreview}
              </code>
            </div>
          </div>
          
          {/* Debug info completo */}
          <div className="mt-4 p-3 bg-black text-green-400 rounded font-mono text-xs">
            <div>Variable completa: {envStatus.fullKey || 'undefined'}</div>
            <div>Todas las variables: {JSON.stringify(import.meta.env, null, 2)}</div>
          </div>
        </div>

        {/* Tester de API Key */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Probar API Key</h3>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={envStatus.keyLength > 0 ? "Usar variable de entorno o pegar nueva key" : "Pega tu API Key de OpenRouter aquí"}
                className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={testAPIConnection}
              disabled={isTestingConnection}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTestingConnection ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Probando conexión...
                </>
              ) : (
                `Probar ${apiKey ? 'API Key Ingresada' : 'Variable de Entorno'}`
              )}
            </button>

            {testResult && (
              <div className={`p-4 rounded-lg ${
                testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span className="font-medium">{testResult.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instrucciones para Render */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Si la API Key no está configurada:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ve a <strong>dashboard.render.com</strong></li>
            <li>Selecciona tu servicio <strong>"ia-giyl"</strong></li>
            <li>Pestaña <strong>"Environment"</strong></li>
            <li>Add Environment Variable:
              <div className="mt-2 p-2 bg-white rounded border font-mono text-xs">
                Name: VITE_OPENROUTER_API_KEY<br/>
                Value: sk-or-v1-[tu-key-completa-aquí]
              </div>
            </li>
            <li><strong>"Save Changes"</strong></li>
            <li>Pestaña <strong>"Deploys"</strong> → <strong>"Trigger deploy"</strong></li>
            <li>Espera a que termine el deploy (5-10 minutos)</li>
            <li>Recarga esta página y prueba de nuevo</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
