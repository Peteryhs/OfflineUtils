import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

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
      className={`flex items-center justify-between p-2 bg-gray-800/50 backdrop-blur-xl rounded-lg border border-gray-700 cursor-move transition-opacity`}
      style={{ opacity }}
    >
      <span className="truncate flex-1 text-gray-300">{name}</span>
      <button
        onClick={onRemove}
        className="ml-2 text-red-400 hover:text-red-300 transition-colors"
      >
        Remove
      </button>
    </div>
  );
};