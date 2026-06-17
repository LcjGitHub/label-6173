import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import gearData from '../mock/gear.json';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { PrintPreviewLayout } from '../components/PrintPreviewLayout';
import '../styles/print.css';

const mockGear = gearData as GearItem[];

export function PrintPreviewPage() {
  const navigate = useNavigate();
  const selectedIds = usePackStore((s) => s.selectedIds);
  const customGear = usePackStore((s) => s.customGear);

  const allGear = useMemo(() => [...mockGear, ...customGear], [customGear]);

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => allGear.find((g) => g.id === id))
        .filter((g): g is GearItem => g !== undefined),
    [selectedIds, allGear],
  );

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/pack');
  };

  return (
    <div className="print-preview">
      <div className="print-preview__toolbar">
        <Button icon="arrow-left" onClick={handleBack}>
          返回打包页
        </Button>
        <Button intent="primary" icon="print" onClick={handlePrint}>
          打印清单
        </Button>
      </div>
      <PrintPreviewLayout items={selectedItems} />
    </div>
  );
}
