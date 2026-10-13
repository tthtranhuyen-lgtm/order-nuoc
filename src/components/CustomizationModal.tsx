import React, { useState, useMemo } from 'react';
import { X, Volume2, Plus, Minus, Check, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { DrinkItem, CupSize, SugarLevel, IceLevel, DiningOption, OrderItem } from '../types/menu';
import { CUP_SIZES, SUGAR_LEVELS, ICE_LEVELS, DINING_OPTIONS, TOPPINGS_DATA } from '../data/drinks';
import { buildOrderSentence, formatVND } from '../utils/sentenceBuilder';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface CustomizationModalProps {
  drink: DrinkItem | null;
  onClose: () => void;
  onAddToCart: (item: OrderItem) => void;
  showPinyin: boolean;
  speechRate: number;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  drink,
  onClose,
  onAddToCart,
  showPinyin,
  speechRate,
}) => {
  if (!drink) return null;

  // Customization state
  const [size, setSize] = useState<CupSize>('medium');
  const [sugar, setSugar] = useState<SugarLevel>('70');
  const [ice, setIce] = useState<IceLevel>('less');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [dining, setDining] = useState<DiningOption>('takeaway');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSpeakingFull, setIsSpeakingFull] = useState<boolean>(false);
  const [isSpeakingSlow, setIsSpeakingSlow] = useState<boolean>(false);

  // Price calculations
  const sizeOption = CUP_SIZES.find((s) => s.key === size) || CUP_SIZES[1];
  const toppingsExtra = selectedToppings.reduce((sum, tid) => {
    const t = TOPPINGS_DATA.find((top) => top.id === tid);
    return sum + (t ? t.priceVnd : 0);
  }, 0);

  const unitPrice = Math.max(0, drink.priceVnd + sizeOption.extraPrice + toppingsExtra);
  const totalPrice = unitPrice * quantity;

  // Build spoken sentence
  const sentence = useMemo(() => {
    return buildOrderSentence(drink, size, sugar, ice, selectedToppings, dining, quantity);
  }, [drink, size, sugar, ice, selectedToppings, dining, quantity]);

  // Pronounce specific option
  const handleSpeakOption = (e: React.MouseEvent, textZh: string) => {
    e.stopPropagation();
    sounds.playTap();
    speakChinese(textZh, speechRate);
  };

  // Pronounce full sentence
  const handleSpeakFullSentence = (slow: boolean = false) => {
    sounds.playTap();
    if (slow) {
      setIsSpeakingSlow(true);
      speakChinese(sentence.chinese, 0.65).then(() => setIsSpeakingSlow(false));
    } else {
      setIsSpeakingFull(true);
      speakChinese(sentence.chinese, speechRate).then(() => setIsSpeakingFull(false));
    }
  };

  const toggleTopping = (toppingId: string) => {
    sounds.playTap();
    setSelectedToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
    );
  };

  const handleConfirmOrder = () => {
    sounds.playCashRegister();
    const orderItem: OrderItem = {
      orderId: 'order_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      drink,
      size,
      sugar,
      ice,
      toppings: selectedToppings,
      dining,
      quantity,
      unitPrice,
      totalPrice,
      chineseSentence: sentence.chinese,
      pinyinSentence: sentence.pinyin,
      vietnameseSentence: sentence.vietnamese,
    };
    onAddToCart(orderItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Realistic Drink Photo & Info */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white/40 shrink-0 bg-stone-900">
              <img
                src={drink.imageUrl}
                alt={drink.nameVi}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {drink.categoryNameVi}
                </span>
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {drink.categoryNameZh}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1 leading-tight">{drink.nameZh}</h2>
              {showPinyin && (
                <p className="text-amber-100 font-semibold text-xs sm:text-sm">{drink.pinyin}</p>
              )}
              <p className="text-xs sm:text-sm font-medium text-white/90">{drink.nameVi}</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* LIVE PRACTICE PANEL (Hộp luyện đọc câu gọi món) */}
          <div className="rounded-2xl bg-amber-50/80 border-2 border-amber-300 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Câu Thực Hành Gọi Món Chuẩn (点单口语)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeakFullSentence(false)}
                  disabled={isSpeakingFull}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                    isSpeakingFull ? 'bg-amber-700 animate-pulse' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeakingFull ? 'Đang đọc...' : 'Nghe cả câu'}</span>
                </button>
                <button
                  onClick={() => handleSpeakFullSentence(true)}
                  disabled={isSpeakingSlow}
                  title="Nghe tốc độ chậm để luyện phát âm rõ từng chữ"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-amber-800 hover:bg-amber-100 border border-amber-300 shadow-xs"
                >
                  <span>🐢 Nghe chậm</span>
                </button>
              </div>
            </div>

            {/* Spoken Chinese Sentence */}
            <p className="text-lg sm:text-xl font-black text-stone-900 tracking-wide font-sans leading-relaxed">
              {sentence.chinese}
            </p>

            {/* Pinyin sentence */}
            {showPinyin && (
              <p className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide mt-1">
                {sentence.pinyin}
              </p>
            )}

            {/* Vietnamese meaning */}
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5 pt-1.5 border-t border-amber-200/60">
              <span className="font-semibold text-stone-700">Dịch nghĩa: </span>
              {sentence.vietnamese}
            </p>
          </div>

          {/* 1. Chọn Size Ly (杯型) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span>1. Chọn Size Ly</span>
                <span className="text-amber-700 font-semibold">(杯型 bēixíng)</span>
              </label>
              <span className="text-xs text-stone-500">Bấm loa để nghe từng size</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {CUP_SIZES.map((s) => {
                const isSelected = size === s.key;
                return (
                  <div
                    key={s.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      sounds.playTap();
                      setSize(s.key);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        sounds.playTap();
                        setSize(s.key);
                      }
                    }}
                    className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-base font-black text-stone-900">{s.nameZh}</div>
                        {showPinyin && <div className="text-xs text-amber-700 font-medium">{s.pinyin}</div>}
                        <div className="text-xs text-stone-600 mt-0.5">{s.nameVi}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleSpeakOption(e, s.nameZh)}
                        title={`Nghe: ${s.nameZh}`}
                        className="p-1 rounded-md text-stone-400 hover:text-amber-700 hover:bg-amber-100/60"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {s.extraPrice !== 0 && (
                      <div className="text-[11px] font-bold text-amber-700 mt-2">
                        {s.extraPrice > 0 ? `+${formatVND(s.extraPrice)}` : formatVND(s.extraPrice)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn Độ Ngọt / Lượng Đường (甜度) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span>2. Chọn Lượng Đường</span>
                <span className="text-amber-700 font-semibold">(甜度 tiándù)</span>
              </label>
              <span className="text-xs text-stone-500">Khuyên dùng: 70% hoặc 50%</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUGAR_LEVELS.map((s) => {
                const isSelected = sugar === s.key;
                return (
                  <div
                    key={s.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      sounds.playTap();
                      setSugar(s.key);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        sounds.playTap();
                        setSugar(s.key);
                      }
                    }}
                    className={`relative p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900">{s.nameZh}</div>
                      {showPinyin && <div className="text-[11px] text-amber-700 font-medium">{s.pinyin}</div>}
                      <div className="text-[11px] text-stone-500">{s.key}% đường</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleSpeakOption(e, s.nameZh)}
                      title={`Nghe: ${s.nameZh}`}
                      className="p-1 rounded-md text-stone-400 hover:text-amber-700 hover:bg-amber-100/60"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Chọn Lượng Đá (冰度) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span>3. Chọn Lượng Đá</span>
                <span className="text-amber-700 font-semibold">(冰度 bīngdù)</span>
              </label>
              <span className="text-xs text-stone-500">Đá hoặc nóng</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ICE_LEVELS.map((i) => {
                const isSelected = ice === i.key;
                return (
                  <div
                    key={i.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      sounds.playTap();
                      setIce(i.key);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        sounds.playTap();
                        setIce(i.key);
                      }
                    }}
                    className={`relative p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900">{i.nameZh}</div>
                      {showPinyin && <div className="text-[11px] text-amber-700 font-medium">{i.pinyin}</div>}
                      <div className="text-[11px] text-stone-500">{i.nameVi.split(' ')[0]}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleSpeakOption(e, i.nameZh)}
                      title={`Nghe: ${i.nameZh}`}
                      className="p-1 rounded-md text-stone-400 hover:text-amber-700 hover:bg-amber-100/60"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Chọn Topping Thêm (加料) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <span>4. Thêm Topping</span>
                <span className="text-amber-700 font-semibold">(加料 jiāliào)</span>
              </label>
              <span className="text-xs text-stone-500">Có thể chọn nhiều loại</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TOPPINGS_DATA.map((t) => {
                const isSelected = selectedToppings.includes(t.id);
                return (
                  <div
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleTopping(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleTopping(t.id);
                      }
                    }}
                    className={`relative p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-stone-900">{t.nameZh}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      {showPinyin && <div className="text-[11px] text-amber-700 font-medium">{t.pinyin}</div>}
                      <div className="text-[11px] text-stone-500">{t.nameVi}</div>
                      <div className="text-[11px] font-bold text-amber-700 mt-1">
                        +{formatVND(t.priceVnd)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleSpeakOption(e, t.nameZh)}
                      title={`Nghe: ${t.nameZh}`}
                      className="p-1 rounded-md text-stone-400 hover:text-amber-700 hover:bg-amber-100/60 self-start"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Hình Thức Uống (打包 vs 堂食) & Số lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
            {/* Dining options */}
            <div>
              <label className="text-sm font-bold text-stone-800 block mb-2">
                5. Hình Thức Uống <span className="text-amber-700">(打包 / 堂食)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DINING_OPTIONS.map((d) => {
                  const isSelected = dining === d.key;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setDining(d.key);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-500/20'
                          : 'border-stone-200 text-stone-700 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="text-sm font-bold">{d.nameZh}</div>
                      {showPinyin && <div className="text-[11px] text-amber-700 font-medium">{d.pinyin}</div>}
                      <div className="text-[11px] text-stone-500 mt-0.5">{d.nameVi}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-bold text-stone-800 block mb-2">
                Số Lượng Ly <span className="text-amber-700">(数量 shùliàng)</span>
              </label>
              <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setQuantity((prev) => Math.max(1, prev - 1));
                  }}
                  className="w-10 h-10 rounded-lg bg-white hover:bg-stone-200 flex items-center justify-center font-bold text-stone-700 shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center font-black text-lg text-stone-900">
                  {quantity} <span className="text-xs font-normal text-stone-500">ly</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setQuantity((prev) => prev + 1);
                  }}
                  className="w-10 h-10 rounded-lg bg-white hover:bg-stone-200 flex items-center justify-center font-bold text-stone-700 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer: Total & Add button */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-stone-500 block leading-tight">Tổng cộng món này</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-800">{formatVND(totalPrice)}</span>
              {quantity > 1 && (
                <span className="text-xs text-stone-400">({formatVND(unitPrice)}/ly)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-100"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Thêm Vào Giỏ & Tạo Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
