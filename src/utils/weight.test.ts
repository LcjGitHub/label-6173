import { describe, it, expect } from 'vitest';
import type {
  GearItem,
  SelectedGearDetail,
  BudgetConfig,
  PackTemplate,
} from '../types';
import {
  calcTotalWeight,
  calcCategoryWeightSummaries,
  calcBudgetUsage,
  calcTotalBudgetUsage,
  calcCategoryBudgetUsages,
  compareTemplates,
} from './weight';

const mockGear: GearItem[] = [
  { id: '1', name: '帐篷', category: '住宿', weight: 2000 },
  { id: '2', name: '睡袋', category: '住宿', weight: 800 },
  { id: '3', name: '登山杖', category: '装备', weight: 300 },
  { id: '4', name: '头灯', category: '装备', weight: 100 },
  { id: '5', name: '水壶', category: '厨房', weight: 150 },
  { id: '6', name: '炉头', category: '厨房', weight: 200 },
  { id: '7', name: '背包', category: '装备', weight: 1000 },
  { id: '8', name: '防潮垫', category: '住宿', weight: 400 },
];

function createDetail(gearId: string, quantity: number): SelectedGearDetail {
  const gear = mockGear.find((g) => g.id === gearId)!;
  return {
    gear,
    quantity,
    totalWeight: gear.weight * quantity,
  };
}

describe('calcTotalWeight - 总重量计算', () => {
  it('正常输入：计算多个装备的总重量', () => {
    const details = [
      createDetail('1', 1),
      createDetail('2', 1),
      createDetail('3', 2),
    ];
    expect(calcTotalWeight(details)).toBe(2000 + 800 + 300 * 2);
  });

  it('空列表：返回 0', () => {
    expect(calcTotalWeight([])).toBe(0);
  });

  it('数量大于一件：正确计算多件装备的总重量', () => {
    const details = [
      createDetail('3', 3),
      createDetail('5', 2),
    ];
    expect(calcTotalWeight(details)).toBe(300 * 3 + 150 * 2);
  });

  it('单件装备：正确计算单件重量', () => {
    const details = [createDetail('1', 1)];
    expect(calcTotalWeight(details)).toBe(2000);
  });
});

describe('calcCategoryWeightSummaries - 分类重量汇总', () => {
  it('正常输入：按分类汇总重量并排序', () => {
    const details = [
      createDetail('1', 1),
      createDetail('2', 1),
      createDetail('3', 2),
      createDetail('5', 1),
      createDetail('6', 1),
    ];
    const result = calcCategoryWeightSummaries(details);

    expect(result).toHaveLength(3);
    expect(result[0].category).toBe('住宿');
    expect(result[0].totalWeight).toBe(2800);
    expect(result[0].itemCount).toBe(2);
    expect(result[1].category).toBe('装备');
    expect(result[1].totalWeight).toBe(600);
    expect(result[1].itemCount).toBe(2);
    expect(result[2].category).toBe('厨房');
    expect(result[2].totalWeight).toBe(350);
    expect(result[2].itemCount).toBe(2);

    const totalWeight = 2800 + 600 + 350;
    expect(result[0].weightRatio).toBeCloseTo(2800 / totalWeight);
    expect(result[1].weightRatio).toBeCloseTo(600 / totalWeight);
    expect(result[2].weightRatio).toBeCloseTo(350 / totalWeight);
  });

  it('空列表：返回空数组', () => {
    expect(calcCategoryWeightSummaries([])).toEqual([]);
  });

  it('数量大于一件：正确统计数量和重量', () => {
    const details = [
      createDetail('3', 3),
      createDetail('5', 2),
      createDetail('8', 2),
    ];
    const result = calcCategoryWeightSummaries(details);

    const equipCat = result.find((r) => r.category === '装备')!;
    expect(equipCat.itemCount).toBe(3);
    expect(equipCat.totalWeight).toBe(900);

    const kitchenCat = result.find((r) => r.category === '厨房')!;
    expect(kitchenCat.itemCount).toBe(2);
    expect(kitchenCat.totalWeight).toBe(300);

    const sleepCat = result.find((r) => r.category === '住宿')!;
    expect(sleepCat.itemCount).toBe(2);
    expect(sleepCat.totalWeight).toBe(800);
  });

  it('单一分类：正确返回单个分类汇总', () => {
    const details = [
      createDetail('1', 1),
      createDetail('2', 1),
    ];
    const result = calcCategoryWeightSummaries(details);
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('住宿');
    expect(result[0].weightRatio).toBe(1);
  });
});

describe('calcBudgetUsage - 预算使用情况计算', () => {
  it('正常输入：在预算范围内', () => {
    const result = calcBudgetUsage(500, 1000);
    expect(result.current).toBe(500);
    expect(result.budget).toBe(1000);
    expect(result.ratio).toBe(0.5);
    expect(result.isOver).toBe(false);
  });

  it('预算超限：isOver 为 true，ratio 大于 1', () => {
    const result = calcBudgetUsage(1500, 1000);
    expect(result.current).toBe(1500);
    expect(result.budget).toBe(1000);
    expect(result.ratio).toBe(1.5);
    expect(result.isOver).toBe(true);
  });

  it('预算为 0：返回 ratio 为 1 且 isOver 为 false（预算无效）', () => {
    const result = calcBudgetUsage(500, 0);
    expect(result.ratio).toBe(1);
    expect(result.isOver).toBe(false);
  });

  it('当前重量为 0：ratio 为 0', () => {
    const result = calcBudgetUsage(0, 1000);
    expect(result.ratio).toBe(0);
    expect(result.isOver).toBe(false);
  });

  it('刚好等于预算：isOver 为 false', () => {
    const result = calcBudgetUsage(1000, 1000);
    expect(result.ratio).toBe(1);
    expect(result.isOver).toBe(false);
  });

  it('负数处理：ratio 不会小于 0', () => {
    const result = calcBudgetUsage(-500, 1000);
    expect(result.ratio).toBe(0);
    expect(result.isOver).toBe(false);
  });
});

describe('calcTotalBudgetUsage - 总重量预算使用情况', () => {
  const budgetConfig: BudgetConfig = {
    totalMaxWeight: 5000,
    categories: [
      { category: '住宿', maxWeight: 3000 },
      { category: '装备', maxWeight: 2000 },
      { category: '厨房', maxWeight: 1000 },
    ],
  };

  it('正常输入：在总预算范围内', () => {
    const details = [
      createDetail('1', 1),
      createDetail('2', 1),
    ];
    const result = calcTotalBudgetUsage(details, budgetConfig);
    expect(result.current).toBe(2800);
    expect(result.budget).toBe(5000);
    expect(result.ratio).toBeCloseTo(0.56);
    expect(result.isOver).toBe(false);
  });

  it('总重量预算超限', () => {
    const details = [
      createDetail('1', 3),
      createDetail('7', 1),
    ];
    const result = calcTotalBudgetUsage(details, budgetConfig);
    expect(result.current).toBe(7000);
    expect(result.isOver).toBe(true);
  });

  it('空列表：当前重量为 0', () => {
    const result = calcTotalBudgetUsage([], budgetConfig);
    expect(result.current).toBe(0);
    expect(result.ratio).toBe(0);
    expect(result.isOver).toBe(false);
  });

  it('数量大于一件：正确计算总重量', () => {
    const details = [
      createDetail('3', 5),
      createDetail('4', 3),
    ];
    const result = calcTotalBudgetUsage(details, budgetConfig);
    expect(result.current).toBe(300 * 5 + 100 * 3);
  });
});

describe('calcCategoryBudgetUsages - 各分类预算使用情况', () => {
  const budgetConfig: BudgetConfig = {
    totalMaxWeight: 5000,
    categories: [
      { category: '住宿', maxWeight: 3000 },
      { category: '装备', maxWeight: 2000 },
      { category: '厨房', maxWeight: 500 },
    ],
  };

  it('正常输入：各分类在预算范围内', () => {
    const details = [
      createDetail('1', 1),
      createDetail('3', 2),
      createDetail('5', 1),
    ];
    const result = calcCategoryBudgetUsages(details, budgetConfig);

    expect(result).toHaveLength(3);

    const sleep = result.find((r) => r.category === '住宿')!;
    expect(sleep.current).toBe(2000);
    expect(sleep.isOver).toBe(false);

    const equip = result.find((r) => r.category === '装备')!;
    expect(equip.current).toBe(600);
    expect(equip.isOver).toBe(false);

    const kitchen = result.find((r) => r.category === '厨房')!;
    expect(kitchen.current).toBe(150);
    expect(kitchen.isOver).toBe(false);
  });

  it('分类预算超限', () => {
    const details = [
      createDetail('5', 4),
      createDetail('6', 2),
    ];
    const result = calcCategoryBudgetUsages(details, budgetConfig);

    const kitchen = result.find((r) => r.category === '厨房')!;
    expect(kitchen.current).toBe(150 * 4 + 200 * 2);
    expect(kitchen.isOver).toBe(true);
  });

  it('空列表：所有分类当前重量为 0', () => {
    const result = calcCategoryBudgetUsages([], budgetConfig);
    result.forEach((r) => {
      expect(r.current).toBe(0);
      expect(r.ratio).toBe(0);
      expect(r.isOver).toBe(false);
    });
  });

  it('未选择某分类装备：该分类当前重量为 0', () => {
    const details = [createDetail('1', 1)];
    const result = calcCategoryBudgetUsages(details, budgetConfig);

    const equip = result.find((r) => r.category === '装备')!;
    expect(equip.current).toBe(0);
    expect(equip.ratio).toBe(0);

    const kitchen = result.find((r) => r.category === '厨房')!;
    expect(kitchen.current).toBe(0);
    expect(kitchen.ratio).toBe(0);
  });

  it('数量大于一件：正确计算分类重量', () => {
    const details = [
      createDetail('3', 10),
      createDetail('4', 5),
    ];
    const result = calcCategoryBudgetUsages(details, budgetConfig);

    const equip = result.find((r) => r.category === '装备')!;
    expect(equip.current).toBe(300 * 10 + 100 * 5);
    expect(equip.isOver).toBe(true);
  });
});

describe('compareTemplates - 模板对比计算', () => {
  function createTemplate(
    id: string,
    name: string,
    items: { id: string; quantity: number }[],
  ): PackTemplate {
    return {
      id,
      name,
      selectedItems: items,
      createdAt: '2024-01-01',
    };
  }

  it('正常输入：两模板有共有和独有装备', () => {
    const templateA = createTemplate('t1', '模板A', [
      { id: '1', quantity: 1 },
      { id: '2', quantity: 1 },
      { id: '3', quantity: 1 },
    ]);
    const templateB = createTemplate('t2', '模板B', [
      { id: '1', quantity: 1 },
      { id: '4', quantity: 1 },
      { id: '5', quantity: 2 },
    ]);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.templateA.id).toBe('t1');
    expect(result.templateA.totalWeight).toBe(2000 + 800 + 300);
    expect(result.templateA.itemCount).toBe(3);

    expect(result.templateB.id).toBe('t2');
    expect(result.templateB.totalWeight).toBe(2000 + 100 + 300);
    expect(result.templateB.itemCount).toBe(4);

    expect(result.weightDiff).toBe(3100 - 2400);

    expect(result.commonItems).toHaveLength(1);
    expect(result.commonItems[0].gear.id).toBe('1');

    expect(result.onlyAItems).toHaveLength(2);
    expect(result.onlyAItems.map((i) => i.gear.id)).toEqual(['2', '3']);

    expect(result.onlyBItems).toHaveLength(2);
    expect(result.onlyBItems.map((i) => i.gear.id)).toEqual(['4', '5']);
  });

  it('两模板无共有装备', () => {
    const templateA = createTemplate('t1', '模板A', [
      { id: '1', quantity: 1 },
      { id: '2', quantity: 1 },
    ]);
    const templateB = createTemplate('t2', '模板B', [
      { id: '3', quantity: 1 },
      { id: '4', quantity: 1 },
    ]);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.commonItems).toHaveLength(0);
    expect(result.onlyAItems).toHaveLength(2);
    expect(result.onlyBItems).toHaveLength(2);
    expect(result.weightDiff).toBe(2800 - 400);
  });

  it('两模板完全相同', () => {
    const templateA = createTemplate('t1', '模板A', [
      { id: '1', quantity: 1 },
      { id: '2', quantity: 1 },
    ]);
    const templateB = createTemplate('t2', '模板B', [
      { id: '1', quantity: 1 },
      { id: '2', quantity: 1 },
    ]);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.commonItems).toHaveLength(2);
    expect(result.onlyAItems).toHaveLength(0);
    expect(result.onlyBItems).toHaveLength(0);
    expect(result.weightDiff).toBe(0);
  });

  it('数量大于一件：正确计算重量和数量', () => {
    const templateA = createTemplate('t1', '模板A', [
      { id: '3', quantity: 3 },
      { id: '5', quantity: 2 },
    ]);
    const templateB = createTemplate('t2', '模板B', [
      { id: '3', quantity: 1 },
      { id: '4', quantity: 5 },
    ]);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.templateA.totalWeight).toBe(300 * 3 + 150 * 2);
    expect(result.templateA.itemCount).toBe(5);

    expect(result.templateB.totalWeight).toBe(300 * 1 + 100 * 5);
    expect(result.templateB.itemCount).toBe(6);

    expect(result.weightDiff).toBe(1200 - 800);

    expect(result.commonItems).toHaveLength(1);
    expect(result.commonItems[0].quantity).toBe(3);
  });

  it('空模板：其中一个模板没有装备', () => {
    const templateA = createTemplate('t1', '模板A', [
      { id: '1', quantity: 1 },
    ]);
    const templateB = createTemplate('t2', '模板B', []);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.templateA.totalWeight).toBe(2000);
    expect(result.templateA.itemCount).toBe(1);
    expect(result.templateB.totalWeight).toBe(0);
    expect(result.templateB.itemCount).toBe(0);
    expect(result.commonItems).toHaveLength(0);
    expect(result.onlyAItems).toHaveLength(1);
    expect(result.onlyBItems).toHaveLength(0);
  });

  it('两模板都为空', () => {
    const templateA = createTemplate('t1', '模板A', []);
    const templateB = createTemplate('t2', '模板B', []);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.templateA.totalWeight).toBe(0);
    expect(result.templateB.totalWeight).toBe(0);
    expect(result.weightDiff).toBe(0);
    expect(result.commonItems).toHaveLength(0);
    expect(result.onlyAItems).toHaveLength(0);
    expect(result.onlyBItems).toHaveLength(0);
  });

  it('包含不存在的装备 ID：自动过滤', () => {
    const templateA = createTemplate('t1', '模板A', [
      { id: '1', quantity: 1 },
      { id: 'not-exist', quantity: 1 },
    ]);
    const templateB = createTemplate('t2', '模板B', [
      { id: '1', quantity: 1 },
      { id: '999', quantity: 2 },
    ]);

    const result = compareTemplates(templateA, templateB, mockGear);

    expect(result.templateA.items).toHaveLength(1);
    expect(result.templateA.totalWeight).toBe(2000);
    expect(result.templateB.items).toHaveLength(1);
    expect(result.templateB.totalWeight).toBe(2000);
    expect(result.commonItems).toHaveLength(1);
  });
});
