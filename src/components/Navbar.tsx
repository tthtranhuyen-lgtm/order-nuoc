import React from 'react';
import { Coffee, ShoppingBag, Volume2, Sparkles, Heart } from 'lucide-react';
import { formatVND } from '../utils/sentenceBuilder';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenGrammar: () => void;
  showPinyin: boolean;
  setShowPinyin: (show: boolean) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenGrammar,
  showPinyin,
  setShowPinyin,
  speechRate,
  setSpeechRate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  茶语 <span className="text-amber-600 font-extrabold">CháYǔ</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>Bài học: 你喜欢喝什么？</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Màn hình thực hành gọi món & nói sở thích đồ uống
              </p>
            </div>
          </div>

          {/* Quick Learning Controls & Order Bill */}
          <div className="flex items-center gap-2">
            {/* Open Grammar Guide Button */}
            <button
              onClick={onOpenGrammar}
              title="Xem các mẫu câu giao tiếp và ngữ pháp lúc order nước"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
            >
              <span>📖</span>
              <span className="hidden sm:inline">Mẫu Câu & Ngữ Pháp Order</span>
              <span className="sm:hidden">Mẫu Câu</span>
            </button>
            {/* Pinyin Switch */}
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              title="Bật/Tắt hiển thị Pinyin để thử thách đọc chữ Hán"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                showPinyin
                  ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs'
                  : 'bg-stone-100 border-stone-200 text-stone-500 hover:bg-stone-200'
              }`}
            >
              <span className="font-mono text-sm leading-none">拼</span>
              <span>{showPinyin ? 'Pinyin: Bật' : 'Pinyin: Ẩn'}</span>
            </button>

            {/* Speech rate toggle */}
            <button
              onClick={() => setSpeechRate(speechRate === 0.9 ? 0.7 : 0.9)}
              title="Đổi tốc độ phát âm (0.9x chuẩn hoặc 0.7x chậm cho học sinh)"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Tốc độ: </span>
              <span>{speechRate === 0.9 ? '0.9x' : '0.7x (Chậm)'}</span>
            </button>

            {/* Cart / Bill Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md shadow-amber-600/20 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-amber-200 leading-none">Hóa đơn ({cartCount})</span>
                <span className="text-xs font-bold leading-tight">{formatVND(cartTotal)}</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
