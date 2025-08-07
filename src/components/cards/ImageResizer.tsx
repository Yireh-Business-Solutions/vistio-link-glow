import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crop, RotateCcw, Save } from "lucide-react";

interface ImageResizerProps {
  imageUrl: string;
  onResize: (resizedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageResizer = ({ imageUrl, onResize, onCancel }: ImageResizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [cropArea, setCropArea] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200
  });

  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (ctx) {
        canvas.width = 400;
        canvas.height = 400;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.save();
        ctx.translate(imagePosition.x, imagePosition.y);
        ctx.scale(imageScale, imageScale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        // Draw crop area
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
        
        // Draw resize handle
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(
          cropArea.x + cropArea.width - 10,
          cropArea.y + cropArea.height - 10,
          20,
          20
        );
      }
    }
  }, [imagePosition, imageScale, cropArea]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on resize handle
    const handleX = cropArea.x + cropArea.width - 10;
    const handleY = cropArea.y + cropArea.height - 10;
    
    if (x >= handleX && x <= handleX + 20 && y >= handleY && y <= handleY + 20) {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCropArea(prev => ({
      ...prev,
      width: Math.max(50, prev.width + deltaX),
      height: Math.max(50, prev.height + deltaY)
    }));

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    if (!canvas || !img) return;

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    if (!cropCtx) return;

    cropCanvas.width = cropArea.width;
    cropCanvas.height = cropArea.height;

    // Calculate source coordinates
    const sourceX = (cropArea.x - imagePosition.x) / imageScale;
    const sourceY = (cropArea.y - imagePosition.y) / imageScale;
    const sourceWidth = cropArea.width / imageScale;
    const sourceHeight = cropArea.height / imageScale;

    // Draw cropped image
    cropCtx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, cropArea.width, cropArea.height
    );

    // Convert to blob and call onResize
    cropCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onResize(url);
      }
    }, 'image/jpeg', 0.9);
  };

  const resetImage = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    setCropArea({ x: 50, y: 50, width: 200, height: 200 });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Resize & Crop Image</h3>
            <p className="text-sm text-muted-foreground">
              Drag the blue corner to resize the crop area
            </p>
          </div>

          {/* Hidden image for reference */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Source"
            className="hidden"
            crossOrigin="anonymous"
          />

          {/* Canvas for image editing */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-border rounded-lg cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scale</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={imageScale}
                onChange={(e) => setImageScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-2">
            <Button variant="outline" onClick={resetImage}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageResizer;