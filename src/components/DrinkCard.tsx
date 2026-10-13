import React, { useState } from 'react';
import { Volume2, Heart, Plus, Sparkles, Check } from 'lucide-react';
import { DrinkItem } from '../types/menu';
import { formatVND } from '../utils/sentenceBuilder';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface DrinkCardProps {
  drink: DrinkItem;
  showPinyin: boolean;
  speechRate: number;
  isSelected?: boolean;
  onSelect: (drink: DrinkItem) => void;
  onPracticeLike: (drink: DrinkItem) => void;
  onQuickOrder: (drink: DrinkItem) => void;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({
  drink,
  showPinyin,
  speechRate,
  isSelected = false,
  onSelect,
  onPracticeLike,
  onQuickOrder,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Play drink name
  const handleSpeakName = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    setIsPlaying(true);
    speakChinese(drink.primaryZh, speechRate).then(() => {
      setIsPlaying(false);
    });
  };

  // Practice saying: "我喜欢喝 [Tên món]"
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    setJustLiked(true);
    onPracticeLike(drink);
    setTimeout(() => setJustLiked(false), 1200);
  };

  const handleCardClick = () => {
    sounds.playTap();
    onSelect(drink);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl transform hover:-translate-y-1 ${
        isSelected
          ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-lg'
          : 'border-stone-200/90 hover:border-amber-400'
      }`}
    >
      {/* 1. Realistic Drink Photo */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-stone-100">
        {!imgError ? (
          <img
            src={drink.imageUrl}
            alt={drink.nameVi}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${drink.bgGradient} flex items-center justify-center text-6xl`}
          >
            {drink.imageEmoji}
          </div>
        )}

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 shadow-sm border border-white/50">
            {drink.categoryNameVi}
          </span>

          {drink.popular && (
            <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-rose-500/95 text-white shadow-sm backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-200" />
              Hot
            </span>
          )}
        </div>

        {/* Bottom overlay info on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-[11px] font-medium text-amber-200 bg-stone-900/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {drink.categoryNameZh}
            </span>
            <div className="text-xs text-stone-200 mt-1 line-clamp-1 drop-shadow-sm font-medium">
              {drink.recommended}
            </div>
          </div>
          <span className="text-sm font-black bg-amber-600/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-amber-400/40">
            {formatVND(drink.priceVnd)}
          </span>
        </div>
      </div>

      {/* 2. Drink Details (Hanzi, Pinyin, Vietnamese) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Chinese Characters */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-2xl font-black text-stone-900 tracking-tight leading-snug">
              {drink.nameZh}
            </h3>

            {/* Listen pronunciation button */}
            <button
              onClick={handleSpeakName}
              title={`Nghe phát âm: ${drink.primaryZh}`}
              className={`p-2 rounded-xl transition-all shrink-0 ${
                isPlaying
                  ? 'bg-amber-600 text-white scale-110 shadow-md'
                  : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 border border-stone-200'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Pinyin with tones */}
          {showPinyin && (
            <p className="text-sm font-bold text-amber-700 tracking-wide mt-0.5">
              {drink.pinyin}
            </p>
          )}

          {/* Vietnamese Name */}
          <p className="text-base font-semibold text-stone-700 mt-1">
            {drink.nameVi}
          </p>

          {/* Flavor description */}
          <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
            {drink.descriptionVi}
          </p>
        </div>

        {/* 3. Action Buttons: "Tôi thích..." & "Bấm chọn order" */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
          {/* Practice Saying: "我喜欢喝..." */}
          <button
            onClick={handleLikeClick}
            title="Luyện nói câu: 我喜欢喝 + tên món"
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
              justLiked
                ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-[1.02]'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${justLiked ? 'fill-current animate-ping' : 'fill-current'}`} />
            <span>Nói: 我喜欢喝{drink.primaryZh} (Tôi thích)</span>
          </button>

          {/* Order selection button */}
          <button
            onClick={handleCardClick}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 group-hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Bấm Chọn Order & Chỉnh Đường/Đá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
