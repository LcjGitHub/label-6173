import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';
import { getSelectedDetails } from '../utils/weight';
import { useAllGear } from '../hooks/useAllGear';
import { PrintPreviewLayout } from '../components/PrintPreviewLayout';
import '../styles/print.css';

/**
 * 打印预览页面
 * @description 独立的打印预览页面，展示当前已选装备的清单，
 *              提供返回打包页和触发浏览器打印的功能。
 *              该页面不使用通用 Layout，以确保打印时排版干净。
 */
export function PrintPreviewPage() {
  const navigate = useNavigate();
  const selectedItems = usePackStore((s) => s.selectedItems);
  const allGear = useAllGear();

  /** 已选装备详情列表（按拖拽顺序排列，包含数量） */
  const selectedDetails = useMemo(
    () => getSelectedDetails(selectedItems, allGear),
    [selectedItems, allGear],
  );

  /** 是否已选装备（用于控制按钮禁用状态） */
  const hasItems = selectedDetails.length > 0;

  /** 触发浏览器打印 */
  const handlePrint = () => {
    window.print();
  };

  /** 返回打包页面 */
  const handleBack = () => {
    navigate('/pack');
  };

  return (
    <div className="print-preview">
      {/* 顶部工具栏 - 打印时隐藏 */}
      <div className="print-preview__toolbar">
        <Button icon="arrow-left" onClick={handleBack}>
          返回打包页
        </Button>
        <Button
          intent="primary"
          icon="print"
          onClick={handlePrint}
          disabled={!hasItems}
        >
          打印清单
        </Button>
      </div>
      <PrintPreviewLayout details={selectedDetails} />
    </div>
  );
}
