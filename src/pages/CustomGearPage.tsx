import { Button, Tag } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';
import { CustomGearForm } from '../components/CustomGearForm';
import { formatWeight } from '../utils/weight';

export function CustomGearPage() {
  const customGear = usePackStore((s) => s.customGear);
  const deleteCustomGear = usePackStore((s) => s.deleteCustomGear);

  const categories = [...new Set(customGear.map((g) => g.category))];

  return (
    <div className="custom-gear-page">
      <h2>自定义装备管理</h2>

      <div className="custom-gear-page__section">
        <h3>添加自定义装备</h3>
        <CustomGearForm />
      </div>

      <div className="custom-gear-page__section">
        <h3>已添加的自定义装备</h3>
        {customGear.length === 0 ? (
          <p className="custom-gear-page__empty">暂无自定义装备，请通过上方表单添加。</p>
        ) : (
          <div className="custom-gear-page__list">
            {categories.map((category) => (
              <div key={category} className="custom-gear-page__category">
                <h4 className="custom-gear-page__category-title">{category}</h4>
                {customGear
                  .filter((g) => g.category === category)
                  .map((item) => (
                    <div key={item.id} className="custom-gear-page__item">
                      <span className="custom-gear-page__item-name">{item.name}</span>
                      <Tag minimal>{formatWeight(item.weight)}</Tag>
                      <Button
                        small
                        intent="danger"
                        minimal
                        onClick={() => deleteCustomGear(item.id)}
                      >
                        删除
                      </Button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
