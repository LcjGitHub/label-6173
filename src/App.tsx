import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PackPage } from './pages/PackPage';
import { TemplatesPage } from './pages/TemplatesPage';

/** 根组件：路由配置 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/pack" element={<PackPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="*" element={<Navigate to="/pack" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
