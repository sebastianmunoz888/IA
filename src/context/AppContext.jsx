// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Tipos de consulta y sus configuraciones
export const CONSULTATION_TYPES = {
  GENERAL: {
    id: 'general',
    name: 'Consulta General',
    prompt: 'Eres un asistente legal especializado en derecho colombiano. Proporciona asesoría legal profesional, precisa y actualizada.',
    placeholder: 'Describe tu consulta legal...',
    icon: '⚖️'
  },
  QUICK_CONSULTATION: {
    id: 'quick',
    name: 'Consulta Rápida',
    prompt: 'Proporciona respuestas legales rápidas y concisas en derecho colombiano. Máximo 200 palabras por respuesta.',
    placeholder: 'Pregunta legal rápida...',
    icon: '⚡'
  },
  DOCUMENT_ANALYSIS: {
    id: 'document',
    name: 'Análisis de Documentos',
    prompt: 'Analiza documentos legales con enfoque en derecho colombiano. Identifica cláusulas importantes, riesgos y recomendaciones específicas.',
    placeholder: 'Describe el documento que necesitas analizar...',
    icon: '📄'
  },
  CONTRACT_DRAFTING: {
    id: 'contract',
    name: 'Redacción de Contratos',
    prompt: 'Asiste en la redacción de contratos bajo la legislación colombiana. Proporciona estructuras, cláusulas modelo y recomendaciones específicas.',
    placeholder: 'Describe el tipo de contrato que necesitas redactar...',
    icon: '📝'
  },
  LABOR_LAW: {
    id: 'labor',
    name: 'Derecho Laboral',
    prompt: 'Especialista en derecho laboral colombiano. Conocimiento profundo del Código Sustantivo del Trabajo, decretos reglamentarios y jurisprudencia actual.',
    placeholder: 'Consulta sobre derecho laboral...',
    icon: '👔'
  },
  CORPORATE_LAW: {
    id: 'corporate',
    name: 'Derecho Corporativo',
    prompt: 'Especialista en derecho corporativo y comercial colombiano. Conocimiento en constitución de empresas, fusiones, adquisiciones y gobierno corporativo.',
    placeholder: 'Consulta sobre derecho corporativo...',
    icon: '🏢'
  },
  CIVIL_LAW: {
    id: 'civil',
    name: 'Derecho Civil',
    prompt: 'Especialista en derecho civil colombiano. Conocimiento en derecho de familia, propiedad, obligaciones y responsabilidad civil.',
    placeholder: 'Consulta sobre derecho civil...',
    icon: '🏠'
  }
};

// Contexto de la aplicación
const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
};

// Proveedor de contexto
export const AppProvider = ({ children }) => {
  const [currentConsultationType, setCurrentConsultationType] = useState(CONSULTATION_TYPES.GENERAL);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Función para cambiar tipo de consulta
  const changeConsultationType = (type) => {
    setCurrentConsultationType(type);
    // Agregar mensaje del sistema cuando cambie el tipo
    const systemMessage = {
      type: 'system',
      text: `Modo cambiado a: ${type.name} ${type.icon}`,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, systemMessage]);
  };

  // Función para manejar carga de archivos
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Cambiar automáticamente a modo análisis de documentos
    changeConsultationType(CONSULTATION_TYPES.DOCUMENT_ANALYSIS);
  };

  // Función para limpiar chat
  const clearChat = () => {
    setChatHistory([]);
  };

  const value = {
    // Estados
    currentConsultationType,
    uploadedFile,
    isVoiceMode,
    chatHistory,
    
    // Acciones
    changeConsultationType,
    setCurrentConsultationType,
    handleFileUpload,
    setUploadedFile,
    setIsVoiceMode,
    setChatHistory,
    clearChat,
    
    // Constantes
    CONSULTATION_TYPES
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};