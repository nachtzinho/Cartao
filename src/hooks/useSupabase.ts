import { useState, useCallback } from 'react';
import type { CartaoSalvo } from '@/types';

// Dados mockados para demonstração
const MOCK_CARTOES: CartaoSalvo[] = [];

export function useSupabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salvarCartao = useCallback(async (cartaoData: {
    numero_cartao: string;
    validade: string;
    cvv: string;
    valido: boolean;
    vazado: boolean;
  }) => {
    setLoading(true);
    setError(null);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const novoCartao: CartaoSalvo = {
      id: Date.now(),
      ...cartaoData,
      created_at: new Date().toISOString(),
    };
    
    MOCK_CARTOES.unshift(novoCartao);
    
    setLoading(false);
    return novoCartao;
  }, []);

  const listarCartoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoading(false);
    return [...MOCK_CARTOES];
  }, []);

  const verificarAdmin = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoading(false);
    return username === 'admin' && password === 'admin123';
  }, []);

  return {
    salvarCartao,
    listarCartoes,
    verificarAdmin,
    loading,
    error,
  };
}
