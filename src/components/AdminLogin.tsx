import { useState } from 'react';
import { User, Lock, LogIn, Loader2, Fingerprint } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  
  const { verificarAdmin, loading } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!username || !password) {
      setErro('Preencha todos os campos');
      return;
    }

    const isValid = await verificarAdmin(username, password);
    
    if (isValid) {
      onLogin();
    } else {
      setErro('Credenciais inválidas');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.75rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #f97316, #ef4444, #ec4899)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 10px 25px -5px rgba(249,115,22,0.4)'
          }}>
            <Fingerprint size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Área Administrativa
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Acesso restrito para administradores
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>
              <User size={16} color="#fb923c" />
              Usuário
            </label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <Lock size={16} color="#fb923c" />
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {erro && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '0.75rem'
            }}>
              <p style={{ color: '#f87171', fontSize: '0.875rem', textAlign: 'center', fontWeight: 500 }}>
                {erro}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #ea580c, #dc2626, #db2777)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '0.75rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Verificando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center' }}>
            <span style={{ color: '#fb923c', fontWeight: 500 }}>Dica:</span> Usuário: <span style={{ color: '#9ca3af' }}>admin</span> / Senha: <span style={{ color: '#9ca3af' }}>admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
