import { useState } from 'react';
import { CreditCard3D } from './CreditCard3D';

interface CardFormProps {
  onSubmit?: (data: any) => Promise<any>;
  loading?: boolean;
}

export function CardForm({ onSubmit, loading = false }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null); // Estado para controlar o foco

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => String(currentYear + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  // Formata o número do cartão (lógica simples)
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    
    // Formata visualmente com espaços
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
       // Lógica original de envio...
       await onSubmit({
           card_number: cardNumber.replace(/\s/g, ''),
           card_holder: cardName,
           card_month: cardMonth,
           card_year: cardYear,
           card_cvv: cardCvv,
           card_type: 'visa' // Você pode usar a função getCardType aqui
       });
    }
  };

  return (
    <div className="wrapper"> {/* Wrapper principal do layout */}
      <div className="card-form">
        <div className="card-list">
          <CreditCard3D
            cardNumber={cardNumber}
            cardName={cardName}
            cardMonth={cardMonth}
            cardYear={cardYear}
            cardCvv={cardCvv}
            focusedField={focusedField}
          />
        </div>

        <div className="card-form__inner">
          {/* Número do Cartão */}
          <div className="card-input">
            <label htmlFor="cardNumber" className="card-input__label">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              className="card-input__input"
              value={cardNumber}
              onChange={handleCardNumber}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField(null)}
              autoComplete="off"
            />
          </div>

          {/* Nome do Titular */}
          <div className="card-input">
            <label htmlFor="cardName" className="card-input__label">Card Holders</label>
            <input
              type="text"
              id="cardName"
              className="card-input__input"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onFocus={() => setFocusedField('cardName')}
              onBlur={() => setFocusedField(null)}
              autoComplete="off"
            />
          </div>

          <div className="card-form__row">
            {/* Data de Validade */}
            <div className="card-form__col">
              <div className="card-form__group">
                <label htmlFor="cardMonth" className="card-input__label">Expiration Date</label>
                <select
                  className="card-input__input -select"
                  id="cardMonth"
                  value={cardMonth}
                  onChange={(e) => setCardMonth(e.target.value)}
                  onFocus={() => setFocusedField('cardDate')}
                  onBlur={() => setFocusedField(null)}
                  style={{ marginRight: '10px' }}
                >
                  <option value="" disabled>Month</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  className="card-input__input -select"
                  id="cardYear"
                  value={cardYear}
                  onChange={(e) => setCardYear(e.target.value)}
                  onFocus={() => setFocusedField('cardDate')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="" disabled>Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* CVV */}
            <div className="card-form__col -cvv">
              <div className="card-input">
                <label htmlFor="cardCvv" className="card-input__label">CVV</label>
                <input
                  type="text"
                  className="card-input__input"
                  id="cardCvv"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  onFocus={() => setFocusedField('cardCvv')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <button 
            className="card-form__button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
