import { useState, useCallback } from 'react';
import type { CartaoFormData, VerificationResult } from '@/types';

// Lista de cartões vazados conhecidos (simulação)
const CARTOES_VAZADOS = [
  '4532111122223333',
  '5412751234567890',
  '4111111111111112',
  '5500000000000004',
  '4000000000000002',
];

export function useCardValidation() {
  const [resultado, setResultado] = useState<VerificationResult | null>(null);
  const [verificando, setVerificando] = useState(false);

  // Algoritmo de Luhn para validar número de cartão
  const validarLuhn = useCallback((numero: string): boolean => {
    const cleanNumero = numero.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumero)) return false;

    let soma = 0;
    let alternar = false;

    for (let i = cleanNumero.length - 1; i >= 0; i--) {
      let digito = parseInt(cleanNumero.substring(i, i + 1));

      if (alternar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }

      soma += digito;
      alternar = !alternar;
    }

    return soma % 10 === 0;
  }, []);

  // Validar data de validade
  const validarData = useCallback((validade: string): boolean => {
    const [mes, ano] = validade.split('/');
    if (!mes || !ano) return false;

    const mesNum = parseInt(mes);
    const anoNum = parseInt(ano);

    if (mesNum < 1 || mesNum > 12) return false;

    const agora = new Date();
    const anoAtual = agora.getFullYear() % 100;
    const mesAtual = agora.getMonth() + 1;

    if (anoNum < anoAtual) return false;
    if (anoNum === anoAtual && mesNum < mesAtual) return false;

    return true;
  }, []);

  // Validar CVV
  const validarCVV = useCallback((cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  }, []);

  // Verificar se cartão está na lista de vazados
  const verificarVazado = useCallback((numero: string): boolean => {
    const cleanNumero = numero.replace(/\s/g, '');
    return CARTOES_VAZADOS.includes(cleanNumero);
  }, []);

  // Função principal de verificação
  const verificarCartao = useCallback(async (dados: CartaoFormData): Promise<VerificationResult> => {
    setVerificando(true);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    const numeroLimpo = dados.numeroCartao.replace(/\s/g, '');
    
    // Validar número
    if (!validarLuhn(numeroLimpo)) {
      const resultado: VerificationResult = {
        valido: false,
        vazado: false,
        mensagem: 'Cartão inválido: número do cartão incorreto',
      };
      setResultado(resultado);
      setVerificando(false);
      return resultado;
    }

    // Validar data
    if (!validarData(dados.validade)) {
      const resultado: VerificationResult = {
        valido: false,
        vazado: false,
        mensagem: 'Cartão inválido: data de validade expirada ou incorreta',
      };
      setResultado(resultado);
      setVerificando(false);
      return resultado;
    }

    // Validar CVV
    if (!validarCVV(dados.cvv)) {
      const resultado: VerificationResult = {
        valido: false,
        vazado: false,
        mensagem: 'Cartão inválido: CVV incorreto',
      };
      setResultado(resultado);
      setVerificando(false);
      return resultado;
    }

    // Verificar se está vazado
    const vazado = verificarVazado(numeroLimpo);

    const resultado: VerificationResult = {
      valido: true,
      vazado,
      mensagem: vazado 
        ? '⚠️ ALERTA: Este cartão foi encontrado em vazamentos de dados!' 
        : '✅ Cartão válido e não encontrado em vazamentos',
    };

    setResultado(resultado);
    setVerificando(false);
    return resultado;
  }, [validarLuhn, validarData, validarCVV, verificarVazado]);

  const limparResultado = useCallback(() => {
    setResultado(null);
  }, []);

  return {
    verificarCartao,
    resultado,
    verificando,
    limparResultado,
  };
}
