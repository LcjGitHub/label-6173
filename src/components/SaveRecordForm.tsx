import { useState } from 'react';
import { Button, InputGroup, Label, FormGroup, Callout } from '@blueprintjs/core';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { formatWeight } from '../utils/weight';

interface SaveRecordFormProps {
  allGear: GearItem[];
}

export function SaveRecordForm({ allGear }: SaveRecordFormProps) {
  const [name, setName] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const saveTravelRecord = usePackStore((s) => s.saveTravelRecord);
  const selectedIds = usePackStore((s) => s.selectedIds);

  const totalWeight = selectedIds.reduce((sum, id) => {
    const gear = allGear.find((g) => g.id === id);
    return sum + (gear?.weight || 0);
  }, 0);

  const handleSave = () => {
    if (!name.trim() || !tripDate || selectedIds.length === 0) return;
    saveTravelRecord({ name, tripDate }, allGear);
    setName('');
    setTripDate('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="save-record">
      {showSuccess && (
        <Callout intent="success" className="save-record__success">
          出行记录已保存！可在「出行记录」页面查看。
        </Callout>
      )}
      <FormGroup
        helperText="保存当前勾选的装备清单、总重量、件数和出行信息为一条历史记录"
      >
        <div className="save-record__row">
          <Label>
            出行名称
            <InputGroup
              placeholder="例如：端午武功山徒步"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={selectedIds.length === 0}
            />
          </Label>
        </div>
        <div className="save-record__row">
          <Label>
            出行日期
            <InputGroup
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              disabled={selectedIds.length === 0}
            />
          </Label>
        </div>
        {selectedIds.length > 0 && (
          <div className="save-record__summary">
            <span className="save-record__summary-item">
              共 <strong>{selectedIds.length}</strong> 件装备
            </span>
            <span className="save-record__summary-item">
              总重 <strong>{formatWeight(totalWeight)}</strong>
            </span>
          </div>
        )}
        <Button
          intent="primary"
          onClick={handleSave}
          disabled={!name.trim() || !tripDate || selectedIds.length === 0}
          fill
        >
          保存出行记录
        </Button>
      </FormGroup>
    </div>
  );
}
