import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card as CardType } from "@/hooks/useCards";

interface CardDuplicationProps {
  card: CardType;
  onSuccess: () => void;
}

export default function CardDuplication({ card, onSuccess }: CardDuplicationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [newCardName, setNewCardName] = useState(`${card.name} (Copy)`);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDuplicate = async () => {
    if (!user) return;

    setDuplicating(true);
    try {
      // Create a copy of the card data
      const duplicatedCard = {
        ...card,
        id: undefined, // Let Supabase generate new ID
        name: newCardName,
        slug: `${newCardName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        view_count: 0,
        created_at: undefined, // Let Supabase set current timestamp
        updated_at: undefined,
        user_id: user.id
      };

      const { error } = await supabase
        .from('cards')
        .insert(duplicatedCard);

      if (error) {
        throw error;
      }

      toast({
        title: "Card duplicated successfully!",
        description: `"${newCardName}" has been created as a copy of "${card.name}".`
      });

      setIsOpen(false);
      setNewCardName(`${card.name} (Copy)`);
      onSuccess();
    } catch (error) {
      console.error('Error duplicating card:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="h-3 w-3" />
          Duplicate
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-hero">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-primary bg-clip-text text-transparent">
            Duplicate Card
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Original Card</CardTitle>
              <CardDescription>{card.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Title:</strong> {card.title || 'Not set'}</p>
                <p><strong>Company:</strong> {card.company || 'Not set'}</p>
                <p><strong>Theme:</strong> {card.color_theme || 'Default'}</p>
                <p><strong>Views:</strong> {card.view_count || 0}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="card-name">New Card Name</Label>
            <Input
              id="card-name"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              placeholder="Enter name for the duplicated card"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will create an exact copy with all the same information, images, and settings.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={duplicating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDuplicate}
              disabled={duplicating || !newCardName.trim()}
              className="flex-1 bg-gradient-primary hover:shadow-neon transition-all duration-300"
            >
              {duplicating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Duplicating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Duplicate Card
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}