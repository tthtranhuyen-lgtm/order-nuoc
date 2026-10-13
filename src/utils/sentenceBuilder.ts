import { CupSize, SugarLevel, IceLevel, DiningOption, DrinkItem } from '../types/menu';
import { CUP_SIZES, SUGAR_LEVELS, ICE_LEVELS, DINING_OPTIONS, TOPPINGS_DATA } from '../data/drinks';

export interface SentenceResult {
  chinese: string;
  pinyin: string;
  vietnamese: string;
}

export function buildOrderSentence(
  drink: DrinkItem,
  size: CupSize,
  sugar: SugarLevel,
  ice: IceLevel,
  selectedToppingIds: string[],
  dining: DiningOption,
  quantity: number = 1
): SentenceResult {
  const sizeObj = CUP_SIZES.find((s) => s.key === size) || CUP_SIZES[1];
  const sugarObj = SUGAR_LEVELS.find((s) => s.key === sugar) || SUGAR_LEVELS[1];
  const iceObj = ICE_LEVELS.find((i) => i.key === ice) || ICE_LEVELS[1];
  const diningObj = DINING_OPTIONS.find((d) => d.key === dining) || DINING_OPTIONS[0];

  const toppings = TOPPINGS_DATA.filter((t) => selectedToppingIds.includes(t.id));

  // Quantity Chinese
  const qtyZh = quantity === 1 ? '一杯' : `${quantity === 2 ? '两' : quantity}杯`;
  const qtyPinyin = quantity === 1 ? 'yī bēi' : `${quantity === 2 ? 'liǎng' : quantity} bēi`;
  const qtyVi = quantity === 1 ? '1 ly' : `${quantity} ly`;

  // Build Chinese string
  const partsZh: string[] = [];
  partsZh.push(`你好，我要${qtyZh}${sizeObj.nameZh}${drink.primaryZh}`);
  partsZh.push(sugarObj.nameZh);
  partsZh.push(iceObj.nameZh);

  if (toppings.length > 0) {
    const toppingNames = toppings.map((t) => t.nameZh).join('、');
    partsZh.push(`加${toppingNames}`);
  }

  partsZh.push(`${diningObj.nameZh}。`);

  const chinese = partsZh.join('，').replace('，' + diningObj.nameZh + '。', `，${diningObj.nameZh}。`);

  // Build Pinyin string
  const partsPinyin: string[] = [];
  partsPinyin.push(`Nǐ hǎo, wǒ yào ${qtyPinyin} ${sizeObj.pinyin.replace(/\s+/g, '')} ${drink.primaryZh}`);
  partsPinyin.push(sugarObj.pinyin);
  partsPinyin.push(iceObj.pinyin);

  if (toppings.length > 0) {
    const toppingPinyin = toppings.map((t) => t.pinyin).join(', ');
    partsPinyin.push(`jiā ${toppingPinyin}`);
  }

  partsPinyin.push(`${diningObj.pinyin}.`);
  const pinyin = partsPinyin.join(', ');

  // Build Vietnamese string
  const partsVi: string[] = [];
  partsVi.push(`Xin chào, tôi muốn ${qtyVi} ${drink.nameVi} (${sizeObj.nameVi.split(' ')[0]} ${sizeObj.nameVi.split(' ')[1]})`);
  partsVi.push(sugarObj.nameVi.split(' ')[0] + ' đường');
  partsVi.push(iceObj.nameVi);

  if (toppings.length > 0) {
    const toppingVi = toppings.map((t) => t.nameVi).join(', ');
    partsVi.push(`thêm ${toppingVi}`);
  }

  partsVi.push(diningObj.nameVi.toLowerCase());
  const vietnamese = partsVi.join(', ') + '.';

  return { chinese, pinyin, vietnamese };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
