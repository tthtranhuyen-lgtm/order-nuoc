import React, { useState } from 'react';
import { Volume2, BookOpen, Sparkles, Filter } from 'lucide-react';
import { VOCABULARY_LIST, GRAMMAR_PATTERNS, VocabItem } from '../data/vocabulary';
import { DRINKS_DATA } from '../data/drinks';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface VocabularyViewProps {
  showPinyin: boolean;
  speechRate: number;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({ showPinyin, speechRate }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'drinks' | 'sweetness' | 'ice' | 'size' | 'action' | 'payment'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeak = (id: string, textZh: string) => {
    sounds.playTap();
    setPlayingId(id);
    speakChinese(textZh, speechRate).then(() => {
      setPlayingId(null);
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <BookOpen className="w-3.5 h-3.5 text-sky-200" />
            <span>Sổ Tay Từ Vựng & Cấu Trúc Ngữ Pháp (词汇语法)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Kho Từ Vựng Gọi Món Song Ngữ Trung - Việt
          </h2>
          <p className="text-sky-100 text-sm sm:text-base mt-2 leading-relaxed">
            Học trọn bộ từ vựng 10 món nước thực tế, các mức điều chỉnh đường đá, size ly và cấu trúc ngữ pháp chuẩn để tự tin gọi món tại quán trà sữa, cà phê.
          </p>
        </div>
      </div>

      {/* 1. Golden Grammar Formulas */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-black text-stone-900">
            Cấu Trúc Ngữ Pháp Vàng Khi Gọi Món (句型公式)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRAMMAR_PATTERNS.map((pattern, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Mẫu {idx + 1}
                </span>
                <h4 className="text-base font-bold text-stone-900 mt-2 mb-2">
                  {pattern.title}
                </h4>

                {/* Pattern structure */}
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 leading-relaxed">
                  <div className="font-bold text-amber-900">{pattern.patternZh}</div>
                  {showPinyin && <div className="text-stone-500 mt-1">{pattern.patternPinyin}</div>}
                </div>

                {/* Example sentence */}
                <div className="mt-3 text-xs">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-bold text-stone-900 text-sm">{pattern.exampleZh}</p>
                    <button
                      onClick={() => handleSpeak(`pattern_${idx}`, pattern.exampleZh)}
                      className="p-1 rounded text-stone-400 hover:text-amber-700 shrink-0"
                      title="Nghe ví dụ"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {showPinyin && (
                    <p className="text-amber-800 text-[11px] font-medium mt-0.5">{pattern.examplePinyin}</p>
                  )}
                  <p className="text-stone-600 mt-1 italic">"{pattern.translationVi}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Full 10 Drinks Table & Vocabulary */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍵</span>
            <h3 className="text-lg font-black text-stone-900">
              10 Món Đồ Uống Trọng Tâm Trong Bài Học
            </h3>
          </div>
          <span className="text-xs text-stone-500">Bấm nút loa để nghe phát âm từng món</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {DRINKS_DATA.map((drink, idx) => (
            <div
              key={drink.id}
              className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs hover:border-amber-400 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${drink.bgGradient} flex items-center justify-center text-2xl shadow-xs shrink-0`}
                >
                  {drink.imageEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-400">#{idx + 1}</span>
                    <span className="text-base font-black text-stone-900">{drink.nameZh}</span>
                  </div>
                  {showPinyin && (
                    <div className="text-xs font-medium text-amber-700 mt-0.5">{drink.pinyin}</div>
                  )}
                  <div className="text-xs font-semibold text-stone-700 mt-0.5">{drink.nameVi}</div>
                </div>
              </div>

              <button
                onClick={() => handleSpeak(drink.id, drink.primaryZh)}
                title={`Nghe: ${drink.primaryZh}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Essential Ordering Terminology & Modifiers */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black text-stone-900">
              Thuật Ngữ Tùy Biến (Đường, Đá, Size, Hành Động)
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'sweetness', label: 'Độ ngọt (甜度)' },
              { key: 'ice', label: 'Lượng đá (冰度)' },
              { key: 'size', label: 'Kích cỡ (杯型)' },
              { key: 'action', label: 'Hành động (点单)' },
              { key: 'payment', label: 'Thanh toán (买单)' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedFilter === f.key
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VOCABULARY_LIST.filter((v) => selectedFilter === 'all' || v.category === selectedFilter).map(
            (item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-black text-stone-900">{item.chinese}</h4>
                      {showPinyin && (
                        <p className="text-xs font-semibold text-amber-800 mt-0.5">{item.pinyin}</p>
                      )}
                      <p className="text-xs font-medium text-stone-700 mt-0.5">{item.vietnamese}</p>
                    </div>

                    <button
                      onClick={() => handleSpeak(item.id, item.chinese)}
                      title={`Nghe: ${item.chinese}`}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Example Context */}
                  <div className="mt-3 pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">{item.exampleZh}</span>
                      <button
                        onClick={() => handleSpeak(`ex_${item.id}`, item.exampleZh)}
                        className="text-stone-400 hover:text-stone-700 p-0.5"
                        title="Nghe câu ví dụ"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    {showPinyin && (
                      <p className="text-[11px] text-amber-700 mt-0.5">{item.examplePinyin}</p>
                    )}
                    <p className="text-[11px] text-stone-500 mt-1 italic">"{item.exampleVi}"</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
