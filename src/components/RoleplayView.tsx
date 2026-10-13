import React, { useState } from 'react';
import { Volume2, Play, Square, UserCheck, MessageSquareText, Eye, EyeOff, Sparkles } from 'lucide-react';
import { DIALOGUE_SCENARIOS } from '../data/dialogues';
import { DialogueScenario, DialogueLine } from '../types/menu';
import { speakChinese, stopSpeaking } from '../utils/speech';
import { sounds } from '../utils/sound';

interface RoleplayViewProps {
  showPinyin: boolean;
  speechRate: number;
}

export const RoleplayView: React.FC<RoleplayViewProps> = ({ showPinyin, speechRate }) => {
  const [selectedScenario, setSelectedScenario] = useState<DialogueScenario>(DIALOGUE_SCENARIOS[0]);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  // Play a single line
  const handlePlayLine = (line: DialogueLine) => {
    sounds.playTap();
    setActiveLineId(line.id);
    speakChinese(line.chinese, speechRate).then(() => {
      setActiveLineId(null);
    });
  };

  // Play all lines sequentially
  const handlePlayAll = async () => {
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      setActiveLineId(null);
      return;
    }

    setIsPlayingAll(true);
    for (const line of selectedScenario.lines) {
      setActiveLineId(line.id);
      await speakChinese(line.chinese, speechRate);
      // Brief pause between speaker turns
      await new Promise((r) => setTimeout(r, 600));
    }
    setIsPlayingAll(false);
    setActiveLineId(null);
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Thực Hành Đóng Vai Gọi Món (角色扮演)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hội Thoại Mẫu Khi Order Nước Tại Quán
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Luyện tập giao tiếp thực tế giữa Nhân viên (店员) và Khách hàng (顾客). Bấm vào từng câu để nghe phát âm, hoặc bật chế độ tự động đọc toàn bộ đoạn thoại!
          </p>

          {/* Quick controls bar */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={handlePlayAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all ${
                isPlayingAll
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-white hover:bg-emerald-50 text-emerald-900'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Dừng đoạn thoại</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Phát toàn bộ hội thoại</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all"
            >
              {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranslation ? 'Ẩn bản dịch tiếng Việt' : 'Hiện bản dịch tiếng Việt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        {DIALOGUE_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                sounds.playTap();
                stopSpeaking();
                setIsPlayingAll(false);
                setActiveLineId(null);
                setSelectedScenario(sc);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <div>{sc.titleVi}</div>
              <div className="text-[11px] font-normal opacity-90">{sc.titleZh}</div>
            </button>
          );
        })}
      </div>

      {/* Scenario Details & Description */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-stone-700">
        <span className="font-bold text-amber-900">Bối cảnh: </span>
        <span>{selectedScenario.descriptionVi}</span>
      </div>

      {/* Dialogue Chat Stream */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {selectedScenario.lines.map((line) => {
          const isCashier = line.speaker === 'cashier';
          const isActive = activeLineId === line.id;

          return (
            <div
              key={line.id}
              className={`flex items-start gap-3 transition-all ${
                isCashier ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Speaker Avatar */}
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold shadow-xs shrink-0 ${
                  isCashier
                    ? 'bg-amber-600 text-white'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {isCashier ? '🧑‍🍳' : '🙋'}
              </div>

              {/* Message Bubble */}
              <div
                onClick={() => handlePlayLine(line)}
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 cursor-pointer transition-all shadow-xs border ${
                  isActive
                    ? 'ring-3 ring-amber-400 bg-amber-50 border-amber-400 scale-[1.01]'
                    : isCashier
                    ? 'bg-white hover:bg-stone-50 border-stone-200'
                    : 'bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200'
                }`}
              >
                {/* Speaker role badge & audio button */}
                <div
                  className={`flex items-center justify-between gap-2 mb-2 ${
                    isCashier ? '' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCashier
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {line.speakerZh} ({line.speakerVi})
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayLine(line);
                    }}
                    title="Nghe câu này"
                    className={`p-1.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  </button>
                </div>

                {/* Chinese text */}
                <p className="text-base sm:text-lg font-black text-stone-900 tracking-wide font-sans leading-relaxed">
                  {line.chinese}
                </p>

                {/* Pinyin */}
                {showPinyin && (
                  <p className="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide mt-1">
                    {line.pinyin}
                  </p>
                )}

                {/* Vietnamese translation */}
                {showTranslation && (
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 pt-2 border-t border-stone-100">
                    {line.vietnamese}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
