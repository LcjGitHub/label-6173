import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import gearData from '../mock/gear.json';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { GearList } from '../components/GearList';
import { WeightSummary } from '../components/WeightSummary';
import { SelectedGearList } from '../components/SelectedGearList';
import { SaveTemplateForm } from '../components/SaveTemplateForm';
import { SaveRecordForm } from '../components/SaveRecordForm';

const mockGear = gearData as GearItem[];

/** 打包页面：装备勾选 + 实时汇总 + 保存模板 */
export function PackPage() {
  const navigate = useNavigate();
  const selectedIds = usePackStore((s) => s.selectedIds);
  const customGear = usePackStore((s) => s.customGear);
  const toggleGear = usePackStore((s) => s.toggleGear);
  const clearSelection = usePackStore((s) => s.clearSelection);
  const reorderSelected = usePackStore((s) => s.reorderSelected);

  const allGear = useMemo(() => [...mockGear, ...customGear], [customGear]);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => allGear.find((g) => g.id === id))
        .filter((g): g is GearItem => g !== undefined),
    [selectedIds, allGear],
  );

  return (
    <div className="pack-page">
      <div className="pack-page__left">
        <div className="pack-page__section-header">
          <h2>装备库</h2>
          <Button small onClick={clearSelection} disabled={selectedIds.length === 0}>
            清空选择
          </Button>
        </div>
        <GearList
          items={allGear}
          selectedIds={selectedIdSet}
          onToggle={toggleGear}
        />
      </div>

      <div className="pack-page__right">
        <WeightSummary selectedItems={selectedItems} />

        <div className="pack-page__section">
          <Button
            intent="primary"
            icon="eye-open"
            fill
            onClick={() => navigate('/print-preview')}
            disabled={selectedIds.length === 0}
          >
            预览清单
          </Button>
        </div>

        <div className="pack-page__section">
          <h3>已选装备（可拖拽排序）</h3>
          <SelectedGearList items={selectedItems} onReorder={reorderSelected} />
        </div>

        <div className="pack-page__section">
          <h3>保存模板</h3>
          <SaveTemplateForm />
        </div>

        <div className="pack-page__section">
          <h3>保存出行记录</h3>
          <SaveRecordForm allGear={allGear} />
        </div>
      </div>
    </div>
  );
}
