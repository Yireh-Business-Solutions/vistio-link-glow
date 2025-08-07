import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyEditButtonProps {
  isVisible: boolean;
  onSave: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

const StickyEditButton = ({ isVisible, onSave, hasUnsavedChanges }: StickyEditButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleSave}
        disabled={isSaving || !hasUnsavedChanges}
        className={cn(
          "shadow-xl backdrop-blur-sm transition-all duration-300",
          hasUnsavedChanges
            ? "bg-gradient-primary hover:shadow-neon border-neon-blue"
            : justSaved
            ? "bg-green-500 hover:bg-green-600"
            : "bg-muted hover:bg-muted/80",
          "px-6 py-3 text-base font-medium"
        )}
      >
        {isSaving ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : justSaved ? (
          <Check className="h-5 w-5 mr-2" />
        ) : (
          <Save className="h-5 w-5 mr-2" />
        )}
        {isSaving ? "Saving..." : justSaved ? "Saved!" : "Save Changes"}
      </Button>
    </div>
  );
};

export default StickyEditButton;