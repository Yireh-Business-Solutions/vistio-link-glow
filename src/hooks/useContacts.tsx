import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Contact {
  id: string;
  card_id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  created_at: string;
}

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteContact: (contactId: string) => Promise<{ success: boolean; error?: string }>;
  exportContacts: (format: 'csv' | 'vcf') => void;
  getContactStats: () => {
    total: number;
    thisWeek: number;
    thisMonth: number;
    byCard: { [cardId: string]: number };
  };
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContacts = async () => {
    if (!user) {
      setContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all contacts for cards owned by the current user
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          cards!inner(
            id,
            name,
            user_id
          )
        `)
        .eq('cards.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const deleteContact = async (contactId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        return { success: false, error: error.message };
      }

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete contact' 
      };
    }
  };

  const exportContacts = (format: 'csv' | 'vcf') => {
    if (contacts.length === 0) return;

    if (format === 'csv') {
      const csvHeaders = ['Name', 'Email', 'Phone', 'Message', 'Source', 'Date'];
      const csvRows = contacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone || '',
        contact.message || '',
        contact.source,
        new Date(contact.created_at).toLocaleDateString()
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'vcf') {
      const vcfContent = contacts.map(contact => [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contact.name}`,
        `EMAIL:${contact.email}`,
        contact.phone ? `TEL:${contact.phone}` : '',
        contact.message ? `NOTE:${contact.message}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n')).join('\n\n');

      const blob = new Blob([vcfContent], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_${new Date().toISOString().split('T')[0]}.vcf`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getContactStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = contacts.filter(contact => 
      new Date(contact.created_at) >= oneWeekAgo
    ).length;

    const thisMonth = contacts.filter(contact => 
      new Date(contact.created_at) >= oneMonthAgo
    ).length;

    const byCard = contacts.reduce((acc, contact) => {
      acc[contact.card_id] = (acc[contact.card_id] || 0) + 1;
      return acc;
    }, {} as { [cardId: string]: number });

    return {
      total: contacts.length,
      thisWeek,
      thisMonth,
      byCard
    };
  };

  const value = {
    contacts,
    loading,
    error,
    refetch: fetchContacts,
    deleteContact,
    exportContacts,
    getContactStats
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};