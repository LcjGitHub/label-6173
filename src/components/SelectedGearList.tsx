import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { Tag, InputGroup } from '@blueprintjs/core';
import type { SelectedGearDetail } from '../types';
import { formatWeight } from '../utils/weight';

interface SelectedGearListProps {
  /** 已选装备详情（按顺序，包含数量） */
  items: SelectedGearDetail[];
  /** 拖拽排序回调 */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** 数量变更回调 */
  onQuantityChange: (id: string, quantity: number) => void;
}

/** 已选装备拖拽排序列表 */
export function SelectedGearList({ items, onReorder, onQuantityChange }: SelectedGearListProps) {
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
            {items.map((detail, index) => (
              <QuantityInputItem
                key={detail.gear.id}
                detail={detail}
                index={index}
                onQuantityChange={onQuantityChange}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

interface QuantityInputItemProps {
  detail: SelectedGearDetail;
  index: number;
  onQuantityChange: (id: string, quantity: number) => void;
}

function QuantityInputItem({ detail, index, onQuantityChange }: QuantityInputItemProps) {
  const [localValue, setLocalValue] = useState<string>(detail.quantity.toString());
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(detail.quantity.toString());
    }
  }, [detail.quantity, isEditing]);

  const commitQuantity = () => {
    setIsEditing(false);
    const trimmed = localValue.trim();
    const parsed = parseInt(trimmed, 10);
    const finalQuantity = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setLocalValue(finalQuantity.toString());
    onQuantityChange(detail.gear.id, finalQuantity);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Draggable key={detail.gear.id} draggableId={detail.gear.id} index={index}>
      {(dragProvided, snapshot) => (
        <div
          className={`selected-list__item${snapshot.isDragging ? ' selected-list__item--dragging' : ''}`}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
        >
          <span className="selected-list__drag-handle" {...dragProvided.dragHandleProps}>
            <span className="selected-list__index">{index + 1}</span>
          </span>
          <span className="selected-list__name">{detail.gear.name}</span>
          <div className="selected-list__quantity">
            <InputGroup
              type="number"
              min={1}
              value={localValue}
              onChange={(e) => {
                setLocalValue(e.target.value);
                setIsEditing(true);
              }}
              onFocus={() => setIsEditing(true)}
              onBlur={commitQuantity}
              onKeyDown={handleKeyDown}
              className="selected-list__quantity-input"
              aria-label={`${detail.gear.name}数量`}
              placeholder="数量"
              small
            />
            <span className="selected-list__quantity-label">件</span>
          </div>
          <Tag minimal className="selected-list__weight">
            {formatWeight(detail.totalWeight)}
          </Tag>
        </div>
      )}
    </Draggable>
  );
}
