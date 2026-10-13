export type DrinkCategory = 'all' | 'tea' | 'coffee' | 'juice' | 'milktea';

export interface DrinkItem {
  id: string;
  nameVi: string;
  nameZh: string;
  pinyin: string;
  primaryZh: string; // The primary characters to say in sentence builder
  category: DrinkCategory;
  categoryNameVi: string;
  categoryNameZh: string;
  priceVnd: number;
  descriptionVi: string;
  descriptionZh: string;
  imageUrl: string;
  imageEmoji: string;
  bgGradient: string;
  accentColor: string;
  popular?: boolean;
  recommended?: string;
  ingredientsZh: string[];
}

export type CupSize = 'small' | 'medium' | 'large';
export type SugarLevel = '100' | '70' | '50' | '30' | '0';
export type IceLevel = 'regular' | 'less' | 'no_ice' | 'hot';
export type DiningOption = 'takeaway' | 'dine_in';

export interface ToppingOption {
  id: string;
  nameZh: string;
  pinyin: string;
  nameVi: string;
  priceVnd: number;
}

export interface CustomizationOptionItem {
  key: string;
  nameZh: string;
  pinyin: string;
  nameVi: string;
  extraPrice: number;
}

export interface OrderItem {
  orderId: string;
  drink: DrinkItem;
  size: CupSize;
  sugar: SugarLevel;
  ice: IceLevel;
  toppings: string[]; // topping ids
  dining: DiningOption;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  chineseSentence: string;
  pinyinSentence: string;
  vietnameseSentence: string;
}

export interface DialogueLine {
  id: string;
  speaker: 'cashier' | 'customer';
  speakerZh: string;
  speakerVi: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
}

export interface DialogueScenario {
  id: string;
  titleZh: string;
  titleVi: string;
  descriptionVi: string;
  lines: DialogueLine[];
}

export interface QuizQuestion {
  id: string;
  type: 'listen' | 'hanzi' | 'order_sentence';
  prompt: string;
  promptZh?: string;
  audioZh?: string;
  options?: {
    id: string;
    text: string;
    textZh?: string;
    pinyin?: string;
    isCorrect: boolean;
  }[];
  scrambledWords?: { id: string; wordZh: string; pinyin: string; meaningVi: string }[];
  correctOrder?: string[]; // IDs in correct order
  explanationVi: string;
}
