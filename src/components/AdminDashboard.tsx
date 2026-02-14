import { useState, useEffect } from 'react';
import { 
  LogOut, 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Search,
  Eye,
  EyeOff,
  ShieldAlert,
  Database
} from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import type { CartaoSalvo } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [cartoes, setCartoes] = useState<CartaoSalvo[]>([]);
  const [filteredCartoes, setFilteredCartoes] = useState<CartaoSalvo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarSensivel, setMostrarSensivel] = useState<Record<number, boolean>>({});
  const { listarCartoes, loading } = useSupabase();

  const carregarCartoes = async () => {
    const data = await listarCartoes();
    setCartoes(data);
    setFilteredCartoes(data);
  };

  useEffect(() => {
    carregarCartoes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cartoes.filter(c => 
        c.numero_cartao.includes(searchTerm) ||
        c.validade.includes(searchTerm)
      );
      setFilteredCartoes(filtered);
    } else {
      setFilteredCartoes(cartoes);
    }
  }, [searchTerm, cartoes]);

  const toggleSensivel = (id: number) => {
    setMostrarSensivel(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatarNumeroCartao = (numero: string, mostrar: boolean) => {
    if (mostrar) {
      const grupos = numero.match(/.{1,4}/g);
      return grupos ? grupos.join(' ') : numero;
    }
    return `•••• •••• •••• ${numero.slice(-4)}`;
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: cartoes.length,
    validos: cartoes.filter(c => c.valido).length,
    invalidos: cartoes.filter(c => !c.valido).length,
    vazados: cartoes.filter(c => c.vazado).length,
  };

  const cardStyle = (borderColor: string) => ({
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '1rem',
    padding: '1.25rem',
    border: `1px solid ${borderColor}`
  });

  return (
    <div style={{ width: '100%', maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column' as const, 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem' 
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #6366f1, #9333ea)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={24} color="white" />
            </div>
            Painel Administrativo
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
            Gerencie os cartões verificados no sistema
          </p>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={cardStyle('rgba(255,255,255,0.1)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Database size={16} color="#60a5fa" />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total</p>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{stats.total}</p>
        </div>

        <div style={cardStyle('rgba(16,185,129,0.2)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CheckCircle size={16} color="#34d399" />
            <p style={{ color: '#34d399', fontSize: '0.875rem' }}>Válidos</p>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#34d399' }}>{stats.validos}</p>
        </div>

        <div style={cardStyle('rgba(245,158,11,0.2)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <XCircle size={16} color="#fbbf24" />
            <p style={{ color: '#fbbf24', fontSize: '0.875rem' }}>Inválidos</p>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fbbf24' }}>{stats.invalidos}</p>
        </div>

        <div style={cardStyle('rgba(239,68,68,0.2)')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldAlert size={16} color="#f87171" />
            <p style={{ color: '#f87171', fontSize: '0.875rem' }}>Vazados</p>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f87171' }}>{stats.vazados}</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} color="#6b7280" style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)' 
          }} />
          <input
            type="text"
            placeholder="Buscar por número ou validade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>
        <button
          onClick={carregarCartoes}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.75rem',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={16} />}
          Atualizar
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead style={{ background: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Número do Cartão</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Validade</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>CVV</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Data</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 }}>Ações</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {filteredCartoes.map((cartao) => (
                <tr key={cartao.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                      {formatarNumeroCartao(cartao.numero_cartao, mostrarSensivel[cartao.id] || false)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#d1d5db', fontFamily: 'monospace', fontSize: '0.875rem' }}>{cartao.validade}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: '#d1d5db', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {mostrarSensivel[cartao.id] ? cartao.cvv : '•••'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {cartao.valido ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 500 }}>
                          <span style={{ width: '0.5rem', height: '0.5rem', background: '#34d399', borderRadius: '50%' }} />
                          Válido
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 500 }}>
                          <span style={{ width: '0.5rem', height: '0.5rem', background: '#fbbf24', borderRadius: '50%' }} />
                          Inválido
                        </span>
                      )}
                      {cartao.vazado && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#f87171', fontSize: '0.75rem', fontWeight: 500 }}>
                          <AlertTriangle size={12} />
                          Vazado
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    {formatarData(cartao.created_at)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => toggleSensivel(cartao.id)}
                      style={{
                        padding: '0.25rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer'
                      }}
                    >
                      {mostrarSensivel[cartao.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCartoes.length === 0 && !loading && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CreditCard size={32} color="#4b5563" />
            </div>
            <p style={{ color: '#9ca3af' }}>
              {searchTerm ? 'Nenhum cartão encontrado' : 'Nenhum cartão verificado ainda'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
