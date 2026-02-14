import { useState, useEffect } from 'react';
import { CardForm } from './components/CardForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const handleAdminLogin = () => setIsAdminLoggedIn(true);
  const handleAdminLogout = () => setIsAdminLoggedIn(false);

  const navigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const navigateToAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('admin');
    window.history.pushState({}, '', '/admin');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #020617 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        top: '5rem',
        left: '2.5rem',
        width: '18rem',
        height: '18rem',
        background: 'rgba(99,102,241,0.2)',
        borderRadius: '50%',
        filter: 'blur(64px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '5rem',
        right: '2.5rem',
        width: '24rem',
        height: '24rem',
        background: 'rgba(168,85,247,0.2)',
        borderRadius: '50%',
        filter: 'blur(64px)',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          <nav style={{ 
            maxWidth: '80rem', 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <a 
              href="/" 
              onClick={navigateToHome}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: 'white',
                textDecoration: 'none'
              }}
            >
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(135deg, #6366f1, #9333ea)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              Verificador
            </a>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href="/"
                onClick={navigateToHome}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  background: currentPage === 'home' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: currentPage === 'home' ? 'white' : '#9ca3af'
                }}
              >
                Início
              </a>
              <a
                href="/admin"
                onClick={navigateToAdmin}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  background: currentPage === 'admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: currentPage === 'admin' ? 'white' : '#9ca3af'
                }}
              >
                Admin
              </a>
            </div>
          </nav>
        </header>

        {/* Main */}
        <main style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {currentPage === 'home' ? (
            <CardForm />
          ) : isAdminLoggedIn ? (
            <AdminDashboard onLogout={handleAdminLogout} />
          ) : (
            <AdminLogin onLogin={handleAdminLogin} />
          )}
        </main>

        {/* Footer */}
        <footer style={{ 
          padding: '1.5rem', 
          textAlign: 'center', 
          borderTop: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            2024 Verificador de Cartões
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
