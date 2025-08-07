import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageResizerProps {
  imageUrl: string;
  onResize: (resizedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageResizer = ({ imageUrl, onResize, onCancel }: ImageResizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 300, height: 300 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      
      // Draw the image
      ctx?.drawImage(img, 0, 0, 400, 400);
      
      // Draw crop overlay
      if (ctx) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
        
        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
      }
    };
    
    img.src = imageUrl;
  }, [imageUrl, cropArea]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on resize handle
    const handleSize = 8;
    const handleX = cropArea.x + cropArea.width - handleSize/2;
    const handleY = cropArea.y + cropArea.height - handleSize/2;
    
    if (x >= handleX && x <= handleX + handleSize && y >= handleY && y <= handleY + handleSize) {
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
      width: Math.max(50, Math.min(400 - prev.x, prev.width + deltaX)),
      height: Math.max(50, Math.min(400 - prev.y, prev.height + deltaY))
    }));

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    
    croppedCanvas.width = cropArea.width;
    croppedCanvas.height = cropArea.height;

    const img = new Image();
    img.onload = () => {
      croppedCtx?.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      );
      
      const croppedImageUrl = croppedCanvas.toDataURL('image/jpeg', 0.8);
      onResize(croppedImageUrl);
    };
    
    img.src = imageUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-white p-6 max-w-lg w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Resize Profile Image</h3>
        <p className="text-sm text-gray-600 mb-4">Drag the blue handle to resize the crop area</p>
        
        <div className="mb-4 flex justify-center">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
        
        <div className="flex gap-3">
          <Button onClick={handleCrop} className="flex-1">
            Apply Crop
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ImageResizer;