import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InputGroup, HTMLSelect, Callout, Intent } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';
import { getSelectedDetails, calcTotalWeight, formatWeight } from '../utils/weight';
import { useAllGear } from '../hooks/useAllGear';
import { GearList } from '../components/GearList';
import { WeightSummary } from '../components/WeightSummary';
import { SelectedGearList } from '../components/SelectedGearList';
import { SaveTemplateForm } from '../components/SaveTemplateForm';
import { SaveRecordForm } from '../components/SaveRecordForm';

/**
 * 打包页面：装备勾选 + 实时汇总 + 保存模板
 * 包含重量上限预警功能：
 * - 在汇总区域上方提供重量上限设置输入框（单位：克）
 * - 采用本地编辑态管理输入，避免清空后无法更新的问题
 * - 输入仅允许非负整数，与预算页的重量预算配置相互独立
 * - 未设置上限时显示空白占位「未设置上限」且不触发预警
 * - 总重量超限时汇总面板边框和总重量数字变为警告色，页面顶部显示超出上限提示
 */
export function PackPage() {
  const navigate = useNavigate();
  const selectedItems = usePackStore((s) => s.selectedItems);
  /** 打包页专用的重量上限，与预算页配置独立 */
  const packPageMaxWeight = usePackStore((s) => s.packPageMaxWeight);
  const toggleGear = usePackStore((s) => s.toggleGear);
  const clearSelection = usePackStore((s) => s.clearSelection);
  const reorderSelected = usePackStore((s) => s.reorderSelected);
  const setQuantity = usePackStore((s) => s.setQuantity);
  const setPackPageMaxWeight = usePackStore((s) => s.setPackPageMaxWeight);
  const allGear = useAllGear();

  /** 装备名称搜索关键词，用于模糊匹配过滤装备列表 */
  const [searchKeyword, setSearchKeyword] = useState('');
  /** 分类筛选值，空字符串表示不筛选，非空时仅显示对应分类 */
  const [categoryFilter, setCategoryFilter] = useState('');
  /**
   * 重量上限本地编辑态
   * 采用字符串类型存储用户输入，与预算页保持一致的编辑模式
   * 避免直接绑定数值导致清空后无法正常更新的问题
   */
  const [maxWeightInput, setMaxWeightInput] = useState<string>(
    packPageMaxWeight > 0 ? packPageMaxWeight.toString() : '',
  );

  /**
   * 当 store 中的重量上限发生变化时同步到本地输入态
   * 确保外部修改（如模板加载、数据迁移等）能正确反映到输入框
   */
  useEffect(() => {
    setMaxWeightInput(packPageMaxWeight > 0 ? packPageMaxWeight.toString() : '');
  }, [packPageMaxWeight]);

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

  const totalWeight = useMemo(
    () => calcTotalWeight(selectedDetails),
    [selectedDetails],
  );

  /**
   * 超重判断逻辑
   * 仅当设置了有效上限（> 0）且当前总重量超过上限时才判定为超重
   * 未设置上限或上限为 0 时不触发预警
   */
  const isOverWeight = packPageMaxWeight > 0 && totalWeight > packPageMaxWeight;

  /**
   * 处理重量上限输入变化
   * 仅允许非负整数输入，空值表示取消上限设置
   * 采用本地编辑态 + 同步更新 store 的模式，与预算页保持一致
   */
  const handleMaxWeightChange = (value: string) => {
    setMaxWeightInput(value);
    const trimmed = value.trim();
    if (trimmed === '') {
      setPackPageMaxWeight(0);
      return;
    }
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num >= 0) {
      setPackPageMaxWeight(num);
    }
  };

  return (
    <div className="pack-page">
      {isOverWeight && (
        <Callout
          className="pack-page__overweight-alert"
          intent={Intent.DANGER}
          icon="warning-sign"
          title="重量超出上限"
        >
          当前总重量 {formatWeight(totalWeight)} 已超过设定上限 {formatWeight(packPageMaxWeight)}，请减少装备或调整上限。
        </Callout>
      )}
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
        <div className="pack-page__section">
          <label className="pack-page__max-weight-label">
            重量上限（克）
          </label>
          <InputGroup
            className="pack-page__max-weight-input"
            placeholder="未设置上限"
            type="number"
            min={0}
            step={1}
            value={maxWeightInput}
            onChange={(e) => handleMaxWeightChange(e.target.value)}
          />
        </div>
        <WeightSummary selectedDetails={selectedDetails} maxWeight={packPageMaxWeight} />

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
