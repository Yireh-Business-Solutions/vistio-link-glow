import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  bucketName: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label: string;
  accept?: string;
  maxSize?: number; // in MB
}

const ImageUpload = ({ 
  bucketName, 
  currentUrl, 
  onUpload, 
  onRemove, 
  label,
  accept = "image/*",
  maxSize = 5
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Please select a file smaller than ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      
      toast({
        title: "Upload successful",
        description: `${label} uploaded successfully`
      });
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeImage = async () => {
    if (!currentUrl) return;
    
    try {
      // Extract filename from URL
      const urlParts = currentUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Delete from storage
      await supabase.storage
        .from(bucketName)
        .remove([fileName]);
      
      onRemove();
      
      toast({
        title: "Image removed",
        description: `${label} removed successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentUrl ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={currentUrl} 
                alt={label}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm font-medium">Image uploaded</p>
                <p className="text-xs text-muted-foreground">Click remove to change</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-2 border-dashed">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Image className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="mt-4">
                <Label htmlFor={`upload-${bucketName}`} className="cursor-pointer">
                  <span className="text-sm font-medium text-foreground hover:text-primary">
                    Click to upload {label.toLowerCase()}
                  </span>
                  <input
                    id={`upload-${bucketName}`}
                    type="file"
                    accept={accept}
                    onChange={uploadImage}
                    disabled={uploading}
                    className="sr-only"
                  />
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: {maxSize}MB
                </p>
              </div>
              {uploading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-muted-foreground mt-2">Uploading...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;