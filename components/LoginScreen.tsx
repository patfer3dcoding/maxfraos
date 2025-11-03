import React, { useState } from 'react';
import type { FSNode, FileNode, SessionInfo } from '../types';
import { MaxfraLogoIcon } from './icons';

interface LoginScreenProps {
  onLoginSuccess: (username: SessionInfo['username']) => void;
  fs: FSNode;
}

const translations = {
  en: {
    title: 'Maxfra Academy OS',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    signInButton: 'Sign In',
    signingInButton: 'Signing in...',
    errorInvalid: 'Invalid username or password.',
    errorSystem: 'A system error occurred. Please try again.'
  },
  es: {
    title: 'Maxfra Academy OS',
    usernameLabel: 'Usuario',
    passwordLabel: 'Contraseña',
    signInButton: 'Iniciar Sesión',
    signingInButton: 'Iniciando sesión...',
    errorInvalid: 'Usuario o contraseña inválidos.',
    errorSystem: 'Ocurrió un error en el sistema. Por favor, inténtelo de nuevo.'
  }
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, fs }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState<'invalid' | 'system' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorKey(null);

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        if (fs.type !== 'directory') throw new Error("Root filesystem is not a directory.");
        
        const systemDir = fs.children.find(c => c.name === 'system' && c.type === 'directory');
        if (!systemDir || systemDir.type !== 'directory') throw new Error("System directory not found in filesystem.");
        
        const usersFile = systemDir.children.find(f => f.name === 'users.json' && f.type === 'file') as FileNode | undefined;
        if (!usersFile) throw new Error("User database file (users.json) not found.");

        const users = JSON.parse(usersFile.content);
        const user = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());

        if (user && user.password === password) {
          onLoginSuccess(user.username);
        } else {
          setErrorKey('invalid');
        }
      } catch (err: any) {
        console.error("Login error:", err);
        setErrorKey('system');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  
  const errorMessages = {
      invalid: translations[language].errorInvalid,
      system: translations[language].errorSystem,
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in">
      <div className="bg-gray-800/80 backdrop-blur-xl text-white p-10 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Español
            </button>
        </div>
        
        {MaxfraLogoIcon("w-24 h-24 mx-auto mb-6")}
        <h1 className="text-2xl font-semibold text-center mb-6">{translations[language].title}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">{translations[language].usernameLabel}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">{translations[language].passwordLabel}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
              required
            />
          </div>
          {errorKey && <p className="text-red-400 text-sm text-center">{errorMessages[errorKey]}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? translations[language].signingInButton : translations[language].signInButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;