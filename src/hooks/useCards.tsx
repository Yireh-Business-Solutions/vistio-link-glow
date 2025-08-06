import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Card {
  id: string;
  user_id: string;
  org_id: string | null;
  slug: string | null;
  name: string;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  work_phone: string | null;
  whatsapp: string | null;
  address: string | null;
  website: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  bio: string | null;
  profile_image_url: string | null;
  company_logo_url: string | null;
  company_logo: string | null;
  color_theme: string | null;
  certifications: string | null;
  awards: string | null;
  specialties: string | null;
  is_primary: boolean | null;
  view_count: number | null;
  created_at: string;
  updated_at: string;
}

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setCards(data || []);
      }
    } catch (err) {
      setError('Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        throw error;
      }

      setCards(prev => prev.filter(card => card.id !== cardId));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId);

      if (error) {
        throw error;
      }

      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, ...updates } : card
      ));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    cards,
    loading,
    error,
    refetch: fetchCards,
    deleteCard,
    updateCard
  };
};