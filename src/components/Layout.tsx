import { NavLink, Outlet } from 'react-router-dom';

/** 应用布局：顶部导航 + 内容区 */
export function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__title">轻量化露营打包</h1>
        <nav className="layout__nav">
          <NavLink
            to="/pack"
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            打包
          </NavLink>
          <NavLink
            to="/custom-gear"
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            自定义装备
          </NavLink>
          <NavLink
            to="/templates"
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            模板管理
          </NavLink>
          <NavLink
            to="/budget"
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            重量预算
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `layout__nav-link${isActive ? ' layout__nav-link--active' : ''}`
            }
          >
            模板对比
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
