import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { Button } from '@/components/ui/button'; // Added Button import
import { X } from 'lucide-react'; // Added X icon import

interface DraggableFileProps {
  id: number;
  name: string;
  index: number;
  moveFile: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggableFile = ({ id, name, index, moveFile, onRemove }: DraggableFileProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'file',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveFile(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'file',
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`flex items-center justify-between p-3 bg-card/50 backdrop-blur-xl rounded-lg border border-border cursor-move transition-opacity`} // Updated classes
      style={{ opacity }}
    >
      <span className="truncate flex-1 text-card-foreground">{name}</span> {/* Updated text color */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="ml-2 text-destructive hover:text-destructive/80 h-7 w-7" // Adjusted size for better click target with icon
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};