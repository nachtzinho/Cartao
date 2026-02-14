import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfig } from '@/lib/supabase';

export interface CardData {
  id: string;
  card_number: string;
  card_holder: string;
  card_month: string;
  card_year: string;
  card_cvv: string;
  card_type: string;
  created_at: string;
  user_id?: string;
}

// Local storage fallback for demo mode
const STORAGE_KEY = 'cards_demo_data';

function getLocalCards(): CardData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalCards(cards: CardData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // Ignore storage errors
  }
}

export function useCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(!supabaseConfig.isConfigured);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!supabaseConfig.isConfigured) {
        // Use local storage in demo mode
        const localCards = getLocalCards();
        setCards(localCards);
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      const { data, error: supabaseError } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      
      setCards((data as CardData[]) || []);
      setIsDemoMode(false);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar cartões');
      // Fallback to local storage on error
      const localCards = getLocalCards();
      setCards(localCards);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCard = async (cardData: Omit<CardData, 'id' | 'created_at'>) => {
    try {
      if (!supabaseConfig.isConfigured) {
        // Demo mode: save to local storage
        const newCard: CardData = {
          ...cardData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        const updated = [newCard, ...getLocalCards()];
        saveLocalCards(updated);
        setCards(updated);
        return { data: newCard, error: null };
      }

      const { data, error: supabaseError } = await supabase
        .from('cards')
        .insert(cardData)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      const newCard = data as CardData;
      setCards(prev => [newCard, ...prev]);
      return { data: newCard, error: null };
    } catch (err) {
      console.error('Error adding card:', err);
      const error = err instanceof Error ? err : new Error('Erro ao adicionar cartão');
      return { data: null, error };
    }
  };

  const deleteCard = async (id: string) => {
    try {
      if (!supabaseConfig.isConfigured) {
        // Demo mode: remove from local storage
        const updated = getLocalCards().filter(c => c.id !== id);
        saveLocalCards(updated);
        setCards(updated);
        return { error: null };
      }

      const { error: supabaseError } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      
      setCards(prev => prev.filter(card => card.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting card:', err);
      const error = err instanceof Error ? err : new Error('Erro ao deletar cartão');
      return { error };
    }
  };

  const updateCard = async (id: string, updates: Partial<CardData>) => {
    try {
      if (!supabaseConfig.isConfigured) {
        // Demo mode: update in local storage
        const updated = getLocalCards().map(c => 
          c.id === id ? { ...c, ...updates } : c
        );
        saveLocalCards(updated);
        setCards(updated);
        const card = updated.find(c => c.id === id);
        return { data: card || null, error: null };
      }

      const { data, error: supabaseError } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      const updatedCard = data as CardData;
      setCards(prev => prev.map(card => card.id === id ? updatedCard : card));
      return { data: updatedCard, error: null };
    } catch (err) {
      console.error('Error updating card:', err);
      const error = err instanceof Error ? err : new Error('Erro ao atualizar cartão');
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return {
    cards,
    loading,
    error,
    isDemoMode,
    fetchCards,
    addCard,
    deleteCard,
    updateCard,
  };
}
