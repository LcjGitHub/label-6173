import { useState } from 'react';
import { Button, Tag, Collapse, Icon, Alert, Intent } from '@blueprintjs/core';
import type { TravelRecord, GearItem } from '../types';
import { formatWeight } from '../utils/weight';

interface RecordCardProps {
  record: TravelRecord;
  onDelete: (id: string) => void;
}

/** 出行记录卡片组件：展示单条出行记录概要信息，支持展开查看详情和删除确认 */
export function RecordCard({ record, onDelete }: RecordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TravelRecord | null>(null);

  const itemsByCategory = record.items.reduce<Record<string, GearItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const formatTripDate = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="record-card">
      <div className="record-card__header">
        <div className="record-card__header-main">
          <h3 className="record-card__name">{record.name}</h3>
          <div className="record-card__meta">
            <Tag round>
              <Icon icon="calendar" size={12} /> {formatTripDate(record.tripDate)}
            </Tag>
            <Tag round>{record.itemCount} 件</Tag>
            <Tag round intent="primary">
              {formatWeight(record.totalWeight)}
            </Tag>
          </div>
        </div>
      </div>

      <p className="record-card__date">
        记录创建于 {new Date(record.createdAt).toLocaleString('zh-CN')}
      </p>

      <div className="record-card__actions">
        <Button
          small
          rightIcon={isExpanded ? 'chevron-up' : 'chevron-down'}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '收起详情' : '查看详情'}
        </Button>
        <Button intent="danger" small onClick={() => setDeleteTarget(record)}>
          删除
        </Button>
      </div>

      <Collapse isOpen={isExpanded}>
        <div className="record-card__details">
          <div className="record-card__summary-row">
            <span className="record-card__summary-label">总重量</span>
            <span className="record-card__summary-value">
              {formatWeight(record.totalWeight)}
            </span>
          </div>
          <div className="record-card__summary-row">
            <span className="record-card__summary-label">装备件数</span>
            <span className="record-card__summary-value">
              {record.itemCount} 件
            </span>
          </div>
          <div className="record-card__summary-row">
            <span className="record-card__summary-label">出行日期</span>
            <span className="record-card__summary-value">
              {formatTripDate(record.tripDate)}
            </span>
          </div>

          <h4 className="record-card__section-title">装备清单</h4>

          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="record-card__category">
              <h5 className="record-card__category-title">
                {category}
                <Tag minimal round className="record-card__category-count">
                  {items.length} 件
                </Tag>
              </h5>
              <div className="record-card__category-items">
                {items.map((item) => (
                  <div key={item.id} className="record-card__item">
                    <span className="record-card__item-name">{item.name}</span>
                    <span className="record-card__item-weight">
                      {formatWeight(item.weight)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Collapse>

      <Alert
        cancelButtonText="取消"
        confirmButtonText="确认删除"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      >
        <p>
          确定要删除出行记录「{deleteTarget?.name}」吗？删除后无法恢复。
        </p>
      </Alert>
    </div>
  );
}
