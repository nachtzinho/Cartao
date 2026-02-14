import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCards } from '@/hooks/useCards';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  LogOut,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  CreditCard,
  RefreshCw,
  Loader2,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CreditCard3D } from '@/components/CreditCard3D';
import { ThemeToggle } from '@/components/ThemeToggle';
import { maskCardNumber } from '@/lib/supabase';

export function AdminDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { cards, loading: cardsLoading, fetchCards, deleteCard, isDemoMode } = useCards();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCards();
    setRefreshing(false);
    toast.success('Dados atualizados!');
  };

  const handleDelete = async () => {
    if (!selectedCard) return;
    
    const { error } = await deleteCard(selectedCard.id);
    if (error) {
      toast.error('Erro ao deletar cartão: ' + error.message);
    } else {
      toast.success('Cartão deletado com sucesso!');
      setDeleteDialogOpen(false);
      setSelectedCard(null);
    }
  };

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('Número copiado!');
  };

  const filteredCards = cards.filter(card =>
    card.card_holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.card_number.includes(searchTerm)
  );

  const stats = {
    total: cards.length,
    visa: cards.filter(c => c.card_type === 'visa').length,
    mastercard: cards.filter(c => c.card_type === 'mastercard').length,
    amex: cards.filter(c => c.card_type === 'amex').length,
  };

  const getCardTypeIcon = (type: string) => {
    return `https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${type}.png`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">CardSecure Admin</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-gray-500 dark:text-slate-400 hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Warning */}
        {isDemoMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-amber-800 dark:text-amber-200 font-medium">Modo Demonstração</p>
              <p className="text-amber-700 dark:text-amber-300/70 text-sm">
                Os dados estão sendo salvos apenas neste dispositivo. Configure o Supabase para persistência permanente.
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Total de Cartões</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Visa</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.visa}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <img src={getCardTypeIcon('visa')} alt="Visa" className="w-8 h-8 object-contain" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Mastercard</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.mastercard}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <img src={getCardTypeIcon('mastercard')} alt="Mastercard" className="w-8 h-8 object-contain" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Amex</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.amex}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <img src={getCardTypeIcon('amex')} alt="Amex" className="w-8 h-8 object-contain" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Cards Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="dark:text-white">Cartões Cadastrados</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar cartão..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cardsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-slate-400">Nenhum cartão encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="dark:border-slate-700">
                        <TableHead className="dark:text-slate-400">Tipo</TableHead>
                        <TableHead className="dark:text-slate-400">Número</TableHead>
                        <TableHead className="dark:text-slate-400">Titular</TableHead>
                        <TableHead className="dark:text-slate-400">Validade</TableHead>
                        <TableHead className="dark:text-slate-400">Data</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCards.map((card) => (
                        <TableRow key={card.id} className="dark:border-slate-700">
                          <TableCell>
                            <img 
                              src={getCardTypeIcon(card.card_type)} 
                              alt={card.card_type}
                              className="w-10 h-6 object-contain"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono dark:text-slate-300">{maskCardNumber(card.card_number)}</span>
                              <button
                                onClick={() => handleCopyNumber(card.card_number)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium dark:text-slate-200">{card.card_holder}</TableCell>
                          <TableCell className="dark:text-slate-300">{card.card_month}/{card.card_year.slice(-2)}</TableCell>
                          <TableCell className="dark:text-slate-400">{new Date(card.created_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedCard(card); setViewDialogOpen(true); }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Visualizar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => { setSelectedCard(card); setDeleteDialogOpen(true); }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Detalhes do Cartão</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-6">
              <CreditCard3D
                cardNumber={selectedCard.card_number.replace(/(\d{4})(?=\d)/g, '$1 ')}
                cardName={selectedCard.card_holder}
                cardMonth={selectedCard.card_month}
                cardYear={selectedCard.card_year}
                cardCvv={showCvv ? selectedCard.card_cvv : '•••'}
                focusedField={null}
              />
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Número Completo</p>
                  <p className="font-mono font-medium dark:text-slate-200">{selectedCard.card_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">CVV</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-medium dark:text-slate-200">{showCvv ? selectedCard.card_cvv : '•••'}</p>
                    <button
                      onClick={() => setShowCvv(!showCvv)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
