import { useState, useMemo } from 'react';
import { Button, InputGroup, Label, FormGroup, Callout } from '@blueprintjs/core';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { formatWeight, getSelectedDetails, calcTotalWeightWithQuantity, calcTotalItemCount } from '../utils/weight';

interface SaveRecordFormProps {
  allGear: GearItem[];
}

/** 保存出行记录表单组件：输入出行名称和日期，将当前勾选装备快照保存为历史记录，含校验提示 */
export function SaveRecordForm({ allGear }: SaveRecordFormProps) {
  const [name, setName] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const saveTravelRecord = usePackStore((s) => s.saveTravelRecord);
  const selectedItems = usePackStore((s) => s.selectedItems);

  const selectedDetails = useMemo(
    () => getSelectedDetails(selectedItems, allGear),
    [selectedItems, allGear],
  );

  const totalWeight = calcTotalWeightWithQuantity(selectedDetails);
  const totalItemCount = calcTotalItemCount(selectedDetails);

  const hasNoSelection = selectedItems.length === 0;
  const isNameEmpty = !name.trim();
  const isDateEmpty = !tripDate;

  const errors: string[] = [];
  if (attempted) {
    if (hasNoSelection) errors.push('请先勾选至少一件装备');
    if (isNameEmpty) errors.push('请输入出行名称');
    if (isDateEmpty) errors.push('请选择出行日期');
  }

  const handleSave = () => {
    setAttempted(true);
    if (isNameEmpty || isDateEmpty || hasNoSelection) return;
    saveTravelRecord({ name, tripDate }, allGear);
    setName('');
    setTripDate('');
    setAttempted(false);
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
              disabled={hasNoSelection}
              intent={attempted && isNameEmpty && !hasNoSelection ? 'danger' : 'none'}
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
              disabled={hasNoSelection}
              intent={attempted && isDateEmpty && !hasNoSelection ? 'danger' : 'none'}
            />
          </Label>
        </div>
        {selectedItems.length > 0 && (
          <div className="save-record__summary">
            <span className="save-record__summary-item">
              共 <strong>{totalItemCount}</strong> 件装备
            </span>
            <span className="save-record__summary-item">
              总重 <strong>{formatWeight(totalWeight)}</strong>
            </span>
          </div>
        )}
        {errors.length > 0 && (
          <div className="save-record__errors">
            {errors.map((msg, i) => (
              <div key={i} className="save-record__error">{msg}</div>
            ))}
          </div>
        )}
        <Button
          intent="primary"
          onClick={handleSave}
          disabled={isNameEmpty || isDateEmpty || hasNoSelection}
          fill
        >
          保存出行记录
        </Button>
      </FormGroup>
    </div>
  );
}
