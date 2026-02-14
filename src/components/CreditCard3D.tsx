import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CreditCard3D.css';

interface CreditCard3DProps {
  cardNumber: string;
  cardName: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
  onFocus?: (element: string) => void;
  onBlur?: () => void;
}

const cardBackgrounds = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=300&fit=crop',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&h=300&fit=crop',
];

export function CreditCard3D({
  cardNumber,
  cardName,
  cardMonth,
  cardYear,
  cardCvv,
  onFocus,
  onBlur,
}: CreditCard3DProps) {
  const [focusStyle, setFocusStyle] = useState<React.CSSProperties | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [bgIndex] = useState(() => Math.floor(Math.random() * cardBackgrounds.length));
  
  const cardNumberRef = useRef<HTMLLabelElement>(null);
  const cardNameRef = useRef<HTMLLabelElement>(null);
  const cardDateRef = useRef<HTMLDivElement>(null);

  const getCardType = useMemo(() => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'visa';
    if (/^(34|37)/.test(number)) return 'amex';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^6011/.test(number)) return 'discover';
    if (/^9792/.test(number)) return 'troy';
    return 'visa';
  }, [cardNumber]);

  const formatCardNumber = useMemo(() => {
    const isAmex = getCardType === 'amex';
    const mask = isAmex ? '#### ###### #####' : '#### #### #### ####';
    let formatted = '';
    let numIndex = 0;
    
    for (let i = 0; i < mask.length && numIndex < cardNumber.length; i++) {
      if (mask[i] === '#') {
        // Ocultar dígitos do meio
        if (numIndex > 3 && numIndex < (isAmex ? 10 : 12) && cardNumber[numIndex] !== ' ') {
          formatted += '*';
        } else {
          formatted += cardNumber[numIndex];
        }
        numIndex++;
      } else {
        formatted += ' ';
      }
    }
    
    // Completar com o mask restante
    while (formatted.length < mask.length) {
      const i = formatted.length;
      if (mask[i] === '#') {
        formatted += '#';
      } else {
        formatted += ' ';
      }
    }
    
    return formatted;
  }, [cardNumber, getCardType]);

  const handleFocus = useCallback((elementRef: React.RefObject<HTMLElement | null>, refName: string) => {
    setIsInputFocused(true);
    onFocus?.(refName);
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const parentRect = elementRef.current.parentElement?.parentElement?.getBoundingClientRect();
      
      if (parentRect) {
        setFocusStyle({
          width: rect.width,
          height: rect.height,
          transform: `translateX(${rect.left - parentRect.left}px) translateY(${rect.top - parentRect.top}px)`,
          opacity: 1,
        });
      }
    }
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsInputFocused(false);
    onBlur?.();
    setTimeout(() => {
      if (!isInputFocused) {
        setFocusStyle(null);
      }
    }, 300);
  }, [isInputFocused, onBlur]);

  const cardBg = cardBackgrounds[bgIndex];

  return (
    <div className="credit-card-container">
      <div className="credit-card">
        {/* Frente do cartão */}
        <div className="credit-card-front">
          <div className="credit-card-focus" style={focusStyle || { opacity: 0 }} />
          <div className="credit-card-cover">
            <img src={cardBg} alt="" className="credit-card-bg" />
          </div>
          <div className="credit-card-content">
            <div className="credit-card-top">
              <img 
                src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" 
                alt="chip" 
                className="credit-card-chip" 
              />
              <AnimatePresence mode="wait">
                <motion.img
                  key={getCardType}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType}.png`}
                  alt={getCardType}
                  className="credit-card-type"
                />
              </AnimatePresence>
            </div>
            
            <label 
              className="credit-card-number" 
              ref={cardNumberRef}
              onMouseEnter={() => handleFocus(cardNumberRef, 'cardNumber')}
              onMouseLeave={handleBlur}
            >
              {formatCardNumber.split('').map((char, index) => (
                <span 
                  key={index} 
                  className={`credit-card-number-char ${char === ' ' ? 'space' : ''} ${char === '#' ? 'placeholder' : ''}`}
                >
                  {char === '#' ? '#' : char}
                </span>
              ))}
            </label>
            
            <div className="credit-card-bottom">
              <label 
                className="credit-card-holder" 
                ref={cardNameRef}
                onMouseEnter={() => handleFocus(cardNameRef, 'cardName')}
                onMouseLeave={handleBlur}
              >
                <span className="credit-card-label">Card Holder</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cardName || 'FULL NAME'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="credit-card-holder-name"
                  >
                    {cardName.toUpperCase() || 'FULL NAME'}
                  </motion.span>
                </AnimatePresence>
              </label>
              
              <div 
                className="credit-card-expiry" 
                ref={cardDateRef}
                onMouseEnter={() => handleFocus(cardDateRef, 'cardDate')}
                onMouseLeave={handleBlur}
              >
                <span className="credit-card-label">Expires</span>
                <span className="credit-card-expiry-date">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cardMonth || 'MM'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {cardMonth || 'MM'}
                    </motion.span>
                  </AnimatePresence>
                  /
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cardYear ? cardYear.slice(-2) : 'YY'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {cardYear ? cardYear.slice(-2) : 'YY'}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verso do cartão */}
        <div className="credit-card-back">
          <div className="credit-card-cover">
            <img src={cardBg} alt="" className="credit-card-bg" />
          </div>
          <div className="credit-card-magnetic-strip" />
          <div className="credit-card-cvv">
            <span className="credit-card-cvv-label">CVV</span>
            <div className="credit-card-cvv-band">
              {cardCvv.split('').map((_, index) => (
                <span key={index}>*</span>
              ))}
            </div>
            <img
              src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType}.png`}
              alt={getCardType}
              className="credit-card-type-back"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCard3D;
