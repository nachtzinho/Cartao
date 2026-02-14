import { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface CardVisualProps {
  numeroCartao: string;
  validade: string;
  cvv: string;
  focoCVV: boolean;
}

export function CardVisual({ numeroCartao, validade, cvv, focoCVV }: CardVisualProps) {
  const [flipped, setFlipped] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    setFlipped(focoCVV);
  }, [focoCVV]);

  // Efeito de shake quando digita
  useEffect(() => {
    if (numeroCartao.length > 0 && numeroCartao.length % 4 === 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 200);
    }
  }, [numeroCartao]);

  const getCardType = (numero: string) => {
    const clean = numero.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (clean.startsWith('5')) return 'mastercard';
    if (clean.startsWith('3')) return 'amex';
    if (clean.startsWith('6')) return 'discover';
    return 'default';
  };

  const cardType = getCardType(numeroCartao);

  const getCardGradient = () => {
    switch (cardType) {
      case 'visa':
        return 'linear-gradient(135deg, #1a1f71 0%, #2d3a8c 50%, #1a1f71 100%)';
      case 'mastercard':
        return 'linear-gradient(135deg, #eb001b 0%, #f79e1b 50%, #eb001b 100%)';
      case 'amex':
        return 'linear-gradient(135deg, #006fcf 0%, #0085e0 50%, #006fcf 100%)';
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)';
    }
  };

  const formatarNumeroDisplay = (numero: string) => {
    const clean = numero.replace(/\s/g, '');
    const padded = clean.padEnd(16, '•');
    const grupos = padded.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : padded;
  };

  const formatarValidadeDisplay = (val: string) => {
    return val || 'MM/AA';
  };

  const formatarCVVDisplay = (cvvVal: string) => {
    return cvvVal.padEnd(3, '•') || '•••';
  };

  return (
    <div 
      className={shaking ? 'card-shake' : ''}
      style={{ 
        width: '100%', 
        maxWidth: '360px', 
        height: '220px', 
        margin: '0 auto 2rem',
        perspective: '1000px'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* Frente do Cartão */}
        <div className="card-face card-front" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '16px',
          padding: '24px',
          background: getCardGradient(),
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Efeito de holograma */}
          <div className="hologram-effect" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            animation: 'hologram 3s ease-in-out infinite'
          }} />

          {/* Partículas de brilho */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '4px',
            height: '4px',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            animation: 'sparkle 2s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '3px',
            height: '3px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '50%',
            animation: 'sparkle 2.5s ease-in-out infinite 0.5s'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '30%',
            left: '20%',
            width: '2px',
            height: '2px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '50%',
            animation: 'sparkle 3s ease-in-out infinite 1s'
          }} />

          {/* Chip e ícones */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '50px',
              height: '38px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.2)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Detalhes do chip */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(0,0,0,0.4)'
              }} />
              <div style={{
                position: 'absolute',
                left: '33%',
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'rgba(0,0,0,0.4)'
              }} />
              <div style={{
                position: 'absolute',
                left: '66%',
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'rgba(0,0,0,0.4)'
              }} />
              <div style={{
                width: '28px',
                height: '20px',
                border: '1px solid rgba(0,0,0,0.3)',
                borderRadius: '4px'
              }} />
            </div>
            <div style={{
              padding: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(4px)'
            }}>
              <Wifi size={24} color="rgba(255,255,255,0.9)" />
            </div>
          </div>

          {/* Número do Cartão */}
          <div style={{ 
            fontSize: '1.6rem', 
            fontFamily: 'monospace', 
            letterSpacing: '0.08em',
            color: 'white',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            position: 'relative',
            zIndex: 1,
            wordSpacing: '0.2em',
            fontWeight: 500
          }}>
            {formatarNumeroDisplay(numeroCartao)}
          </div>

          {/* Rodapé */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', letterSpacing: '0.05em' }}>
                TITULAR DO CARTÃO
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 500
              }}>
                SEU NOME AQUI
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', letterSpacing: '0.05em' }}>
                VALIDADE
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: 'white',
                fontFamily: 'monospace',
                fontWeight: 500
              }}>
                {formatarValidadeDisplay(validade)}
              </div>
            </div>
          </div>

          {/* Logo do tipo de cartão */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '24px',
            zIndex: 1
          }}>
            {cardType === 'visa' && (
              <div style={{ 
                fontSize: '1.75rem', 
                fontWeight: 'bold', 
                color: 'white',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                VISA
              </div>
            )}
            {cardType === 'mastercard' && (
              <div style={{ display: 'flex', marginRight: '-10px' }}>
                <div style={{ 
                  width: '35px', 
                  height: '35px', 
                  background: 'linear-gradient(135deg, #eb001b, #c70018)', 
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }} />
                <div style={{ 
                  width: '35px', 
                  height: '35px', 
                  background: 'linear-gradient(135deg, #f79e1b, #e59116)', 
                  borderRadius: '50%',
                  marginLeft: '-15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }} />
              </div>
            )}
            {cardType === 'amex' && (
              <div style={{
                width: '45px',
                height: '45px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 'bold',
                color: '#006fcf'
              }}>
                AMEX
              </div>
            )}
            {cardType === 'default' && (
              <div style={{
                width: '45px',
                height: '45px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Verso do Cartão */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          transform: 'rotateY(180deg)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Faixa magnética */}
          <div style={{
            height: '50px',
            background: 'linear-gradient(180deg, #0f0f0f 0%, #2a2a2a 30%, #1a1a1a 50%, #2a2a2a 70%, #0f0f0f 100%)',
            marginTop: '30px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'relative'
          }}>
            {/* Linhas da faixa magnética */}
            <div style={{
              position: 'absolute',
              top: '30%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(255,255,255,0.05)'
            }} />
            <div style={{
              position: 'absolute',
              top: '60%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(255,255,255,0.05)'
            }} />
          </div>

          {/* Área do CVV */}
          <div style={{ 
            padding: '25px 30px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'white',
              height: '45px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 18px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                color: '#1e293b',
                letterSpacing: '0.15em',
                fontWeight: 600
              }}>
                {formatarCVVDisplay(cvv)}
              </span>
            </div>
            <div style={{
              fontSize: '0.625rem',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '10px',
              textAlign: 'right',
              letterSpacing: '0.05em'
            }}>
              CÓDIGO DE SEGURANÇA (CVV)
            </div>
          </div>

          {/* Texto de segurança */}
          <div style={{
            padding: '15px 25px',
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
            lineHeight: 1.5,
            letterSpacing: '0.02em'
          }}>
            Este cartão é propriedade do banco emissor e deve ser devolvido quando solicitado. 
            O uso deste cartão está sujeito aos termos e condições do contrato.
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes hologram {
          0%, 100% { transform: translateX(-100%) rotate(45deg); }
          50% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .card-shake {
          animation: cardShake 0.3s ease-in-out;
        }
        @keyframes cardShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
