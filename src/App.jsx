// ✅ Todo esto debe estar en la parte superior del archivo App.jsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppContext, CONSULTATION_TYPES } from './context/AppContext.jsx';

import {
  Menu, Search, Send, Scale, Sun, Moon, ChevronDown, Users,
  HelpCircle, FileText, UploadCloud, Edit3, Mic, Building2,
  Home, Briefcase, Loader2, Sparkles, MessageSquare,
  ArrowRight, X, Zap
} from "lucide-react";

// ✅ Estas constantes deben ir aquí, al tope y fuera de cualquier función
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ✅ MOVER ESTOS COMPONENTES FUERA DEL COMPONENTE PRINCIPAL
// Loading Animation Component
const LoadingDots = React.memo(() => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
});

// Floating particles background - MEMOIZADO
const FloatingParticles = React.memo(({ isDark }) => {
  const particles = useMemo(() => [...Array(10)], []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradiente animado de fondo */}
      <div className={`absolute inset-0 opacity-30 ${
        isDark 
          ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-slate-900/20' 
          : 'bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-gray-50/40'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
      </div>

      {/* Partículas flotantes mejoradas */}
      {particles.map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${
            isDark ? 'bg-blue-400/30' : 'bg-blue-300/40'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            animation: `float-particle ${3 + Math.random() * 2}s ease-in-out infinite alternate, 
                       drift-particle ${8 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Ondas de fondo */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full ${
          isDark ? 'bg-blue-500/5' : 'bg-blue-200/20'
        } animate-ping`} style={{ animationDuration: '4s' }} />
        <div className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full ${
          isDark ? 'bg-purple-500/5' : 'bg-purple-200/20'
        } animate-ping`} style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>
    </div>
  );
});

// Menu Section Component - MEMOIZADO
const MenuSection = React.memo(({ title, items = [], expanded = false, isDark, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="mb-4">
      <button 
        className={`w-full flex items-center justify-between p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
          isDark 
            ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center gap-2">
          <Sparkles size={14} className="opacity-60" />
          {title}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="space-y-1 mt-2 pl-4">
          {items.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => onItemClick?.(item)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] transform hover:translate-x-1 ${
                item.active 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
              }`}
            >
              <div className={`p-1 rounded ${item.active ? 'bg-white/20' : ''}`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.active && <ArrowRight size={14} className="ml-auto opacity-60" />}
              {item.badge && (
                <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

// Sidebar Component - MEMOIZADO
const Sidebar = React.memo(({ isOpen, onToggle, isDark, toggleDark }) => {
  const { currentConsultationType, changeConsultationType, CONSULTATION_TYPES } = useAppContext();

  const handleMenuItemClick = useCallback((item) => {
    // Cambiar tipo de consulta según el item clickeado
    switch (item.id) {
      case 'quick':
        changeConsultationType(CONSULTATION_TYPES.QUICK_CONSULTATION);
        break;
      case 'document':
        changeConsultationType(CONSULTATION_TYPES.DOCUMENT_ANALYSIS);
        break;
      case 'contract':
        changeConsultationType(CONSULTATION_TYPES.CONTRACT_DRAFTING);
        break;
      case 'labor':
        changeConsultationType(CONSULTATION_TYPES.LABOR_LAW);
        break;
      case 'corporate':
        changeConsultationType(CONSULTATION_TYPES.CORPORATE_LAW);
        break;
      case 'civil':
        changeConsultationType(CONSULTATION_TYPES.CIVIL_LAW);
        break;
      case 'upload':
        console.log('Cargar archivos');
        break;
      case 'voice':
        console.log('Consulta por voz');
        break;
      default:
        changeConsultationType(CONSULTATION_TYPES.GENERAL);
    }
    
    // Cerrar sidebar en móvil después de seleccionar
    if (window.innerWidth < 1024) {
      onToggle();
    }
  }, [changeConsultationType, CONSULTATION_TYPES, onToggle]);

  const menuItems = useMemo(() => ({
    servicios: [
      { 
        id: 'general',
        icon: <Users size={18} />, 
        label: "Asesorías Legales", 
        active: currentConsultationType.id === 'general' 
      },
      { 
        id: 'quick',
        icon: <Zap size={18} />, 
        label: "Consultas Rápidas",
        active: currentConsultationType.id === 'quick',
        badge: "Rápido"
      },
      { 
        id: 'document',
        icon: <FileText size={18} />, 
        label: "Análisis de Documentos",
        active: currentConsultationType.id === 'document'
      },
    ],
    herramientas: [
      { 
        id: 'upload',
        icon: <UploadCloud size={18} />, 
        label: "Cargar Archivos" 
      },
      { 
        id: 'contract',
        icon: <Edit3 size={18} />, 
        label: "Redactar Contratos",
        active: currentConsultationType.id === 'contract'
      },
      { 
        id: 'voice',
        icon: <Mic size={18} />, 
        label: "Consulta por Voz",
        badge: "Próximamente"
      },
    ],
    especialidades: [
      { 
        id: 'corporate',
        icon: <Building2 size={18} />, 
        label: "Derecho Corporativo",
        active: currentConsultationType.id === 'corporate'
      },
      { 
        id: 'civil',
        icon: <Home size={18} />, 
        label: "Derecho Civil",
        active: currentConsultationType.id === 'civil'
      },
      { 
        id: 'labor',
        icon: <Briefcase size={18} />, 
        label: "Derecho Laboral",
        active: currentConsultationType.id === 'labor'
      },
    ]
  }), [currentConsultationType.id]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-80 z-50 transition-all duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50' 
          : 'bg-gradient-to-b from-white via-white to-gray-50 border-r border-gray-200'
      } backdrop-blur-xl`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200'} relative overflow-hidden`}>
          <FloatingParticles isDark={isDark} />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Scale size={24} color="white" />
              </div>
              <div>
                <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  IA Legal Pro
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  v2.0 • {currentConsultationType.name}
                </div>
              </div>
            </div>
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              onClick={onToggle}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          <MenuSection 
            title="Servicios Principales" 
            expanded 
            isDark={isDark}
            items={menuItems.servicios}
            onItemClick={handleMenuItemClick}
          />

          <MenuSection 
            title="Herramientas" 
            isDark={isDark}
            items={menuItems.herramientas}
            onItemClick={handleMenuItemClick}
          />

          <MenuSection 
            title="Especialidades" 
            isDark={isDark}
            items={menuItems.especialidades}
            onItemClick={handleMenuItemClick}
          />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={toggleDark}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
              isDark 
                ? 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900'
            } shadow-lg`}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <span className="font-medium">
              {isDark ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
});

// Chat Header Component - MEMOIZADO
const ChatHeader = React.memo(({ onToggleSidebar, isDark }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className={`${
      isDark 
        ? 'bg-slate-900/95 border-slate-700/50' 
        : 'bg-white/95 border-gray-200'
    } backdrop-blur-xl border-b transition-all duration-300 sticky top-0 z-30`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              className={`lg:hidden p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
              }`}
              onClick={onToggleSidebar}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                Asistente Legal Inteligente
              </h1>
              <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} mt-1`}>
                Consulta legal profesional con IA especializada • Colombia
              </p>
            </div>
          </div>
        </div>

        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <Search 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              isFocused 
                ? 'text-blue-500' 
                : isDark ? 'text-slate-400' : 'text-gray-400'
            }`} 
            size={20} 
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full pl-12 pr-6 py-4 rounded-2xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-800' 
                : 'bg-gray-50/50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
            } focus:ring-4 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm`}
            placeholder="Buscar jurisprudencia, leyes, casos similares..."
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

// Chat Window Component - MEMOIZADO
const ChatWindow = React.memo(({ messages, isLoading, isDark }) => {
  const messagesEndRef = useRef(null);
  const { currentConsultationType } = useAppContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestionCards = useMemo(() => [
    {
      icon: "📝",
      title: "Contratos",
      description: "Revisión y redacción de contratos comerciales",
      examples: ["Contrato de trabajo", "Acuerdo comercial", "NDA"],
      consultationType: 'contract'
    },
    {
      icon: "⚖️",
      title: "Derecho Laboral",
      description: "Consultas sobre derechos y obligaciones laborales",
      examples: ["Despido injustificado", "Liquidación", "Acoso laboral"],
      consultationType: 'labor'
    },
    {
      icon: "🏢",
      title: "Derecho Corporativo",
      description: "Constitución de empresas y gobierno corporativo",
      examples: ["Crear SAS", "Fusiones", "Compliance"],
      consultationType: 'corporate'
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Derecho Civil",
      description: "Familia, propiedad y responsabilidad civil",
      examples: ["Divorcio", "Herencias", "Propiedad"],
      consultationType: 'civil'
    }
  ], []);

  return (
    <div className={`flex-1 overflow-y-auto ${
      isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-50 to-white'
    } relative`}>
      <FloatingParticles isDark={isDark} />
      
      <div className="relative z-10 p-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-full">
            <div className="text-center max-w-4xl mx-auto">
              <div className={`inline-flex p-6 rounded-3xl ${
                isDark ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-xl mb-6 shadow-2xl`}>
                <div className="flex items-center gap-3">
                  <Scale size={64} className="text-blue-500 animate-pulse" />
                  <span className="text-4xl">{currentConsultationType.icon}</span>
                </div>
              </div>
              
              <h3 className={`text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {currentConsultationType.name}
              </h3>
              
              <p className={`text-lg mb-8 ${
                isDark ? 'text-slate-300' : 'text-gray-600'
              }`}>
                {currentConsultationType.id === 'general' 
                  ? 'Soy tu asistente legal especializado en derecho colombiano. Puedo ayudarte con consultas profesionales en diversas áreas.'
                  : `Modo especializado en ${currentConsultationType.name.toLowerCase()}. Optimizado para brindarte respuestas específicas y precisas.`
                }
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {suggestionCards.map((card, idx) => (
                  <div 
                    key={idx} 
                    className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                      currentConsultationType.id === card.consultationType
                        ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : ''
                    } ${
                      isDark 
                        ? 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50' 
                        : 'bg-white/70 hover:bg-white border border-gray-200/50'
                    } backdrop-blur-xl shadow-xl hover:shadow-2xl`}
                  >
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h4 className={`font-bold text-lg mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {card.title}
                      {currentConsultationType.id === card.consultationType && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                          Activo
                        </span>
                      )}
                    </h4>
                    <p className={`text-sm mb-3 ${
                      isDark ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      {card.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {card.examples.map((example, i) => (
                        <span 
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <div 
                key={`${msg.type}-${idx}-${msg.timestamp || idx}`}
                className={`flex animate-in slide-in-from-bottom-4 duration-500 ${
                  msg.type === 'user' ? 'justify-end' : 
                  msg.type === 'system' ? 'justify-center' : 'justify-start'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Mensaje del sistema */}
                {msg.type === 'system' ? (
                  <div className={`max-w-md px-4 py-2 rounded-full text-center ${
                    isDark ? 'bg-slate-700/50 text-slate-300' : 'bg-blue-100/50 text-blue-700'
                  } backdrop-blur-sm text-sm`}>
                    {msg.text}
                  </div>
                ) : (
                  /* Mensajes normales */
                  <div className={`max-w-[85%] ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl rounded-tr-lg shadow-lg shadow-blue-500/25' 
                      : isDark
                        ? 'bg-slate-800/70 text-white rounded-3xl rounded-tl-lg border border-slate-700/50'
                        : 'bg-white/70 text-gray-900 rounded-3xl rounded-tl-lg border border-gray-200/50 shadow-lg'
                  } backdrop-blur-xl p-5 transition-all duration-300 hover:scale-[1.02]`}>
                    
                    {msg.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-3 opacity-60">
                        <Scale size={16} />
                        <span className="text-sm font-medium">
                          Asistente Legal • {currentConsultationType.name}
                        </span>
                      </div>
                    )}
                    
                    {msg.isLoading ? (
                      <div className="flex items-center gap-3">
                        <LoadingDots />
                        <span className="text-sm opacity-70">{msg.text}</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
});

// Chat Input Component - MEMOIZADO CON useCallback
const ChatInput = React.memo(({ input, setInput, onSend, isLoading, isDark }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { currentConsultationType } = useAppContext();
  const textareaRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      onSend();
    }
  }, [onSend, isLoading]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, [setInput]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <footer className={`${
      isDark 
        ? 'bg-slate-900/95 border-slate-700/50' 
        : 'bg-white/95 border-gray-200'
    } backdrop-blur-xl border-t transition-all duration-300 sticky bottom-0`}>
      <div className="p-6 max-w-4xl mx-auto">
        
        {/* Indicador de modo actual */}
        {currentConsultationType.id !== 'general' && (
          <div className={`mb-4 p-3 rounded-xl ${
            isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-blue-50/50 border border-blue-200/50'
          } backdrop-blur-sm`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentConsultationType.icon}</span>
              <span className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-blue-700'
              }`}>
                Modo: {currentConsultationType.name}
              </span>
            </div>
          </div>
        )}

        <div className={`flex gap-4 transition-all duration-300 ${
          isFocused ? 'scale-[1.02]' : ''
        }`}>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              className={`w-full px-6 py-4 rounded-2xl resize-none transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-800' 
                  : 'bg-gray-50/50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
              } focus:ring-4 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder={isLoading ? "Procesando consulta..." : currentConsultationType.placeholder}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isLoading}
              rows="1"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            <MessageSquare 
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                isFocused 
                  ? 'text-blue-500' 
                  : isDark ? 'text-slate-400' : 'text-gray-400'
              }`} 
              size={20} 
            />
          </div>
          
          <button
            className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center gap-3 shadow-lg ${
              isLoading || !input.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25'
            } text-white disabled:shadow-none`}
            onClick={onSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Enviar</span>
                <Send size={20} />
              </>
            )}
          </button>
        </div>
        
        <div className={`mt-4 text-xs text-center ${
          isDark ? 'text-slate-400' : 'text-gray-500'
        }`}>
          <span className="inline-flex items-center gap-1">
            <Scale size={12} />
            Las respuestas son orientativas. Consulta con un abogado para casos específicos.
          </span>
        </div>
      </div>
    </footer>
  );
});

// ✅ Aquí empieza el componente principal
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  // Usar el contexto
  const { currentConsultationType } = useAppContext();

  // ✅ useCallback para funciones que se pasan como props
  const toggleSidebar = useCallback(() => setSidebarOpen(!sidebarOpen), [sidebarOpen]);
  const toggleDark = useCallback(() => setIsDark(!isDark), [isDark]);

  // ✅ Función API corregida - usando la constante OPENROUTER_API_KEY
  const sendMessageToAPI = useCallback(async (userMessage) => {
    // ✅ Verificar que la API key existe
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY no está definida');
      return 'Error: API key no configurada. Por favor, configura VITE_OPENROUTER_API_KEY en las variables de entorno.';
    }

    try {
      console.log('Enviando mensaje a OpenRouter API...', {
        hasApiKey: !!OPENROUTER_API_KEY,
        apiKeyLength: OPENROUTER_API_KEY?.length,
        model: 'anthropic/claude-3.5-sonnet'
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // ✅ Usar la constante
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Asistente Legal IA'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: `${currentConsultationType.prompt}

Especialidades:
- Derecho Civil
- Derecho Laboral  
- Derecho Corporativo
- Derecho Comercial
- Derecho de Familia
- Derecho Penal

MODO ACTUAL: ${currentConsultationType.name}
${currentConsultationType.id === 'quick' ? 'IMPORTANTE: Mantén respuestas concisas (máximo 200 palabras).' : ''}
${currentConsultationType.id === 'document' ? 'IMPORTANTE: Enfócate en análisis detallado de cláusulas, riesgos y recomendaciones.' : ''}
${currentConsultationType.id === 'contract' ? 'IMPORTANTE: Proporciona estructuras de contratos y cláusulas modelo.' : ''}

Responde de manera clara, estructurada y profesional. Usa formato markdown cuando sea apropiado para mejorar la legibilidad.
Siempre menciona que tus respuestas son orientativas y recomiendan consultar con un abogado para casos específicos.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: currentConsultationType.id === 'quick' ? 300 : 1000
        })
      });

      console.log('Respuesta de la API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error de la API:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      
      // ✅ Mensaje de error más específico
      if (error.message.includes('401')) {
        return 'Error de autenticación: La API key parece ser inválida o ha expirado. Por favor, verifica tu configuración en las variables de entorno.';
      } else if (error.message.includes('403')) {
        return 'Error de permisos: No tienes acceso a este modelo o has excedido tu cuota.';
      } else if (error.message.includes('429')) {
        return 'Error de límite de velocidad: Has hecho demasiadas solicitudes. Espera un momento antes de intentar nuevamente.';
      } else {
        return `Error al procesar tu consulta: ${error.message}. Por favor, intenta nuevamente.`;
      }
    }
  }, [currentConsultationType]);

  // ✅ Función handleSend optimizada
  const handleSend = useCallback(async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      
      // Agregar mensaje del usuario
      setMessages(prev => [...prev, { 
        type: 'user', 
        text: userMessage,
        timestamp: Date.now()
      }]);
      
      setIsLoading(true);
      setInput(''); // ✅ Limpiar input inmediatamente
      
      const tempId = Date.now();
      const loadingMessage = currentConsultationType.id === 'quick' 
        ? 'Generando respuesta rápida...'
        : currentConsultationType.id === 'document'
        ? 'Analizando documento...'
        : currentConsultationType.id === 'contract'
        ? 'Preparando estructura de contrato...'
        : 'Analizando tu consulta legal...';

      // Agregar mensaje de carga
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: loadingMessage, 
        isLoading: true,
        id: tempId,
        timestamp: Date.now()
      }]);

      try {
        const aiResponse = await sendMessageToAPI(userMessage);
        
        // Reemplazar mensaje de carga con respuesta
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { 
                type: 'ai', 
                text: aiResponse, 
                isLoading: false,
                timestamp: Date.now()
              }
            : msg
        ));
      } catch (error) {
        console.error('Error en handleSend:', error);
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { 
                type: 'ai', 
                text: 'Ha ocurrido un error inesperado. Por favor, verifica tu conexión e intenta nuevamente.',
                isLoading: false,
                timestamp: Date.now()
              }
            : msg
        ));
      } finally {
        setIsLoading(false);
      }
    }
  }, [input, isLoading, sendMessageToAPI, currentConsultationType.id]);

  // ✅ Efectos optimizados
  useEffect(() => {
    localStorage.setItem('darkMode', isDark.toString());
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (!OPENROUTER_API_KEY) {
      console.warn('⚠️ VITE_OPENROUTER_API_KEY no está configurada en las variables de entorno');
      console.log('🔧 Para solucionar este problema:');
      console.log('1. Crea un archivo .env en la raíz del proyecto');
      console.log('2. Agrega: VITE_OPENROUTER_API_KEY=tu_api_key_aqui');
      console.log('3. Reinicia el servidor de desarrollo');
    } else {
      console.log('✅ API Key configurada correctamente');
    }
  }, []);

  // Efecto para cambio de modo de consulta
  useEffect(() => {
    if (currentConsultationType.id !== 'general') {
      const modeChangeMessage = {
        type: 'system',
        text: `🔄 Modo cambiado a: ${currentConsultationType.name} ${currentConsultationType.icon}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modeChangeMessage]);
    }
  }, [currentConsultationType]);

  return (
    <div className={`h-screen flex overflow-hidden ${
      isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    } transition-colors duration-300`}>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        isDark={isDark}
        toggleDark={toggleDark}
      />

      <main className="flex-1 flex flex-col lg:ml-80 min-w-0">
        <ChatHeader onToggleSidebar={toggleSidebar} isDark={isDark} />
        <ChatWindow messages={messages} isLoading={isLoading} isDark={isDark} />
        <ChatInput 
          input={input} 
          setInput={setInput} 
          onSend={handleSend} 
          isLoading={isLoading}
          isDark={isDark}
        />
      </main>
    </div>
  );
}
