import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Tag } from '@blueprintjs/core';
import type { GearItem } from '../types';
import { formatWeight } from '../utils/weight';

interface SelectedGearListProps {
  /** 已选装备（按顺序） */
  items: GearItem[];
  /** 拖拽排序回调 */
  onReorder: (fromIndex: number, toIndex: number) => void;
}

/** 已选装备拖拽排序列表 */
export function SelectedGearList({ items, onReorder }: SelectedGearListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from !== to) {
      onReorder(from, to);
    }
  };

  if (items.length === 0) {
    return <p className="selected-list__empty">尚未选择装备，请从左侧勾选</p>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="selected-gear">
        {(provided) => (
          <div
            className="selected-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    className={`selected-list__item${snapshot.isDragging ? ' selected-list__item--dragging' : ''}`}
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <span className="selected-list__index">{index + 1}</span>
                    <span className="selected-list__name">{item.name}</span>
                    <Tag minimal>{formatWeight(item.weight)}</Tag>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
