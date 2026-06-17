import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PackPage } from './pages/PackPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CustomGearPage } from './pages/CustomGearPage';
import { BudgetPage } from './pages/BudgetPage';
import { ComparePage } from './pages/ComparePage';
import { RecordsPage } from './pages/RecordsPage';

/** 根组件：路由配置 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/pack" element={<PackPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/custom-gear" element={<CustomGearPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="*" element={<Navigate to="/pack" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
