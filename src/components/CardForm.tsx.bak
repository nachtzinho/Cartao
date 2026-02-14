import { useState, useCallback } from 'react';
import { CreditCard3D } from './CreditCard3D';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';

interface CardFormProps {
  onSubmit?: (cardData: {
    card_number: string;
    card_holder: string;
    card_month: string;
    card_year: string;
    card_cvv: string;
    card_type: string;
  }) => Promise<{ error: Error | null }>;
  loading?: boolean;
}

export function CardForm({ onSubmit, loading = false }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => String(currentYear + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const getCardType = useCallback((number: string) => {
    const clean = number.replace(/\s/g, '');
    if (/^4/.test(clean)) return 'visa';
    if (/^(34|37)/.test(clean)) return 'amex';
    if (/^5[1-5]/.test(clean)) return 'mastercard';
    if (/^6011/.test(clean)) return 'discover';
    if (/^9792/.test(clean)) return 'troy';
    return 'visa';
  }, []);

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '');
    const isAmex = getCardType(clean) === 'amex';
    
    if (isAmex) {
      return clean
        .slice(0, 15)
        .replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
        .trim();
    }
    
    return clean
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 15) {
      toast.error('Número do cartão inválido');
      return;
    }

    if (cardCvv.length < 3) {
      toast.error('CVV inválido');
      return;
    }

    if (onSubmit) {
      try {
        const { error } = await onSubmit({
          card_number: cleanNumber,
          card_holder: cardName.trim(),
          card_month: cardMonth,
          card_year: cardYear,
          card_cvv: cardCvv,
          card_type: getCardType(cleanNumber),
        });

        if (error) {
          toast.error('Erro ao salvar cartão: ' + error.message);
        } else {
          setSubmitted(true);
          toast.success('Cartão cadastrado com sucesso!');
          
          // Reset form after 2 seconds
          setTimeout(() => {
            setCardNumber('');
            setCardName('');
            setCardMonth('');
            setCardYear('');
            setCardCvv('');
            setSubmitted(false);
          }, 2000);
        }
      } catch (err) {
        toast.error('Erro inesperado ao processar');
        console.error('Form submit error:', err);
      }
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cartão Cadastrado!</h2>
        <p className="text-gray-600">Seu cartão foi salvo com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-8">
        <CreditCard3D
          cardNumber={cardNumber}
          cardName={cardName}
          cardMonth={cardMonth}
          cardYear={cardYear}
          cardCvv={cardCvv}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl transition-colors">
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-gray-700 dark:text-gray-200 font-medium">
            Número do Cartão
          </Label>
          <Input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className="h-12 text-lg tracking-wider dark:bg-slate-700 dark:text-white"
            maxLength={19}
            autoComplete="cc-number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardName" className="text-gray-700 dark:text-gray-200 font-medium">
            Nome no Cartão
          </Label>
          <Input
            id="cardName"
            type="text"
            placeholder="NOME COMPLETO"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase().replace(/[^A-Z\s]/g, ''))}
            className="h-12 text-lg uppercase dark:bg-slate-700 dark:text-white"
            autoComplete="cc-name"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-200 font-medium">Mês</Label>
            <Select value={cardMonth} onValueChange={setCardMonth}>
              <SelectTrigger className="h-12 dark:bg-slate-700 dark:text-white">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-200 font-medium">Ano</Label>
            <Select value={cardYear} onValueChange={setCardYear}>
              <SelectTrigger className="h-12 dark:bg-slate-700 dark:text-white">
                <SelectValue placeholder="AAAA" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardCvv" className="text-gray-700 dark:text-gray-200 font-medium">
              CVV
            </Label>
            <Input
              id="cardCvv"
              type="text"
              inputMode="numeric"
              placeholder="123"
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="h-12 text-lg tracking-wider dark:bg-slate-700 dark:text-white"
              maxLength={4}
              autoComplete="cc-csc"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            'Cadastrar Cartão'
          )}
        </Button>
      </form>
    </div>
  );
}
