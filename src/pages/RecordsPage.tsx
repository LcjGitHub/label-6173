import { useMemo } from 'react';
import { usePackStore } from '../store/packStore';
import { RecordCard } from '../components/RecordCard';

/** 出行记录页面：查看历史出行记录 */
export function RecordsPage() {
  const travelRecords = usePackStore((s) => s.travelRecords);
  const deleteTravelRecord = usePackStore((s) => s.deleteTravelRecord);

  const sortedRecords = useMemo(
    () =>
      [...travelRecords].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [travelRecords],
  );

  if (travelRecords.length === 0) {
    return (
      <div className="records-page">
        <div className="records-page__header">
          <h2>出行记录</h2>
        </div>
        <p className="records-page__empty">
          暂无出行记录。前往「打包」页面勾选装备后，填写出行信息并保存记录。
        </p>
      </div>
    );
  }

  return (
    <div className="records-page">
      <div className="records-page__header">
        <h2>出行记录</h2>
        <span className="records-page__count">共 {travelRecords.length} 条记录</span>
      </div>
      <div className="records-page__list">
        {sortedRecords.map((record) => (
          <RecordCard key={record.id} record={record} onDelete={deleteTravelRecord} />
        ))}
      </div>
    </div>
  );
}
