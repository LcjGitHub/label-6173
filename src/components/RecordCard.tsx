import { useState } from 'react';
import { Button, Tag, Collapse, Icon } from '@blueprintjs/core';
import type { TravelRecord, GearItem } from '../types';
import { formatWeight } from '../utils/weight';

interface RecordCardProps {
  record: TravelRecord;
  onDelete: (id: string) => void;
}

export function RecordCard({ record, onDelete }: RecordCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemsByCategory = record.items.reduce<Record<string, GearItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="record-card">
      <div className="record-card__header">
        <div className="record-card__header-main">
          <h3 className="record-card__name">{record.name}</h3>
          <div className="record-card__meta">
            <Tag round>
              <Icon icon="calendar" size={12} /> {record.tripDate}
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
        <Button intent="danger" small onClick={() => onDelete(record.id)}>
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
              {record.tripDate}
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
    </div>
  );
}
