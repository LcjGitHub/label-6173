import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InputGroup, HTMLSelect } from '@blueprintjs/core';
import gearData from '../mock/gear.json';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { getSelectedDetails } from '../utils/weight';
import { GearList } from '../components/GearList';
import { WeightSummary } from '../components/WeightSummary';
import { SelectedGearList } from '../components/SelectedGearList';
import { SaveTemplateForm } from '../components/SaveTemplateForm';
import { SaveRecordForm } from '../components/SaveRecordForm';

const mockGear = gearData as GearItem[];

/** 打包页面：装备勾选 + 实时汇总 + 保存模板 */
export function PackPage() {
  const navigate = useNavigate();
  const selectedItems = usePackStore((s) => s.selectedItems);
  const customGear = usePackStore((s) => s.customGear);
  const toggleGear = usePackStore((s) => s.toggleGear);
  const clearSelection = usePackStore((s) => s.clearSelection);
  const reorderSelected = usePackStore((s) => s.reorderSelected);
  const setQuantity = usePackStore((s) => s.setQuantity);

  /** 装备名称搜索关键词，用于模糊匹配过滤装备列表 */
  const [searchKeyword, setSearchKeyword] = useState('');
  /** 分类筛选值，空字符串表示不筛选，非空时仅显示对应分类 */
  const [categoryFilter, setCategoryFilter] = useState('');

  const allGear = useMemo(() => [...mockGear, ...customGear], [customGear]);

  /** 从全部装备中提取不重复的分类名列表，用于分类下拉选项 */
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(allGear.map((g) => g.category))];
    return categories;
  }, [allGear]);

  const selectedIdSet = useMemo(
    () => new Set(selectedItems.map((item) => item.id)),
    [selectedItems],
  );

  const selectedDetails = useMemo(
    () => getSelectedDetails(selectedItems, allGear),
    [selectedItems, allGear],
  );

  return (
    <div className="pack-page">
      <div className="pack-page__left">
        <div className="pack-page__section-header">
          <h2>装备库</h2>
          <Button small onClick={clearSelection} disabled={selectedItems.length === 0}>
            清空选择
          </Button>
        </div>
        {/* 搜索与筛选控件区域：搜索框按名称模糊匹配，分类下拉按分类筛选，两者同时生效 */}
        <div className="pack-page__filter-bar">
          {/* 搜索输入框：按装备名称模糊匹配过滤列表 */}
          <InputGroup
            className="pack-page__search-input"
            placeholder="搜索装备名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            leftIcon="search"
            round
          />
          {/* 分类下拉选择框：按住宿、炊具、服装等分类筛选装备 */}
          <HTMLSelect
            className="pack-page__category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            minimal
          >
            <option value="">全部分类</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </HTMLSelect>
        </div>
        <GearList
          items={allGear}
          selectedIds={selectedIdSet}
          onToggle={toggleGear}
          searchKeyword={searchKeyword}
          categoryFilter={categoryFilter}
        />
      </div>

      <div className="pack-page__right">
        <WeightSummary selectedDetails={selectedDetails} />

        <div className="pack-page__section">
          <Button
            intent="primary"
            icon="eye-open"
            fill
            onClick={() => navigate('/print-preview')}
            disabled={selectedItems.length === 0}
          >
            预览清单
          </Button>
        </div>

        <div className="pack-page__section">
          <h3>已选装备（可拖拽排序）</h3>
          <SelectedGearList
            items={selectedDetails}
            onReorder={reorderSelected}
            onQuantityChange={setQuantity}
          />
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
