
import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
  page: number;
}

interface UseDraggableProps {
  initialPosition: Position;
  onPositionChange?: (position: Position) => void;
  elementId: string;
  disabled?: boolean;
}

export function useDraggable({
  initialPosition,
  onPositionChange,
  elementId,
  disabled = false
}: UseDraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);

  const handleMoveStart = (e: React.MouseEvent) => {
    if (disabled || !onPositionChange) return;
    
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMoveEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    const y = e.clientY;
    
    const element = document.getElementById(elementId);
    if (element) {
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  };

  const handleMoveEnd = (e: MouseEvent) => {
    if (!isDragging || !onPositionChange) return;
    
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMoveEnd);
    
    const newPosition = {
      x: e.clientX,
      y: e.clientY,
      page: position.page
    };
    
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMoveEnd);
    };
  }, [isDragging]);

  return {
    isDragging,
    position,
    handleMoveStart
  };
}
