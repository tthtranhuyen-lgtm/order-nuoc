import React, { useState } from 'react';
import { X, Volume2, BookOpen, Sparkles, CheckCircle, ArrowRight, MessageSquare, Layers } from 'lucide-react';
import { ORDERING_STEPS_DIALOGUES, CORE_GRAMMAR_RULES } from '../data/orderGrammar';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface OrderingGrammarModalProps {
  isOpen: boolean;
  onClose: () => void;
  showPinyin: boolean;
  speechRate: number;
}

export const OrderingGrammarModal: React.FC<OrderingGrammarModalProps> = ({
  isOpen,
  onClose,
  showPinyin,
  speechRate,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'steps' | 'grammar'>('steps');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSpeak = (id: string, textZh: string, slow: boolean = false) => {
    sounds.playTap();
    setPlayingId(id);
    speakChinese(textZh, slow ? 0.65 : speechRate).then(() => {
      setPlayingId(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl shadow-inner border border-white/30">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Sổ tay giao tiếp
                </span>
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                  点单语法口语
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                Ngữ Pháp & Mẫu Câu Lúc Order Nước
              </h2>
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

        {/* Tab switchers */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-4 sm:px-6 pt-3 gap-2">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('steps');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'steps'
                ? 'border-amber-600 text-amber-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Quy Trình Order 5 Bước (点单五步法)</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('grammar');
            }}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'grammar'
                ? 'border-amber-600 text-amber-800 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span>4 Cấu Trúc Ngữ Pháp Vàng (重点语法)</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/50">
          {/* TAB 1: 5-STEP ORDERING PROCESS */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-stone-700">
                <span className="font-bold text-amber-900">💡 Bí quyết gọi nước như người bản xứ: </span>
                <span>Khi order tại quán trà sữa/cà phê, quy trình chuẩn gồm 5 bước từ chào hỏi, chọn size, chỉnh đường đá (nóng/lạnh), thêm topping và thanh toán (MoMo/Ngân hàng/Tiền mặt).</span>
              </div>

              <div className="space-y-5">
                {ORDERING_STEPS_DIALOGUES.map((dialogue) => (
                  <div
                    key={dialogue.step}
                    className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:border-amber-300 transition-all space-y-4"
                  >
                    {/* Step Header */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                          {dialogue.step}
                        </span>
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                          {dialogue.stepNameVi}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {dialogue.stepNameZh}
                      </span>
                    </div>

                    {/* Cashier prompt */}
                    <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                          🧑‍🍳 Thu ngân hỏi (店员):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeak(`cashier_${dialogue.step}`, dialogue.cashier.chinese, false)}
                            className="p-1 rounded bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs flex items-center gap-1"
                            title="Nghe câu này"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">Nghe</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-base font-black text-stone-900 mt-1">
                        {dialogue.cashier.chinese}
                      </p>
                      {showPinyin && (
                        <p className="text-xs font-semibold text-amber-800 mt-0.5">
                          {dialogue.cashier.pinyin}
                        </p>
                      )}
                      <p className="text-xs text-stone-600 mt-1 italic">
                        "{dialogue.cashier.vietnamese}"
                      </p>
                    </div>

                    {/* Customer options */}
                    <div>
                      <span className="text-xs font-bold text-stone-700 block mb-2">
                        🙋 Bạn có thể trả lời (顾客可选回复):
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {dialogue.customerOptions.map((opt) => (
                          <div
                            key={opt.id}
                            className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-start justify-between gap-2"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-stone-900 font-sans">
                                  {opt.chinese}
                                </span>
                                {opt.tag && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    {opt.tag}
                                  </span>
                                )}
                              </div>
                              {showPinyin && (
                                <p className="text-xs font-semibold text-amber-800 mt-0.5">
                                  {opt.pinyin}
                                </p>
                              )}
                              <p className="text-xs text-stone-600 mt-1">
                                {opt.vietnamese}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 pt-0.5">
                              <button
                                onClick={() => handleSpeak(opt.id, opt.chinese, false)}
                                title="Nghe chuẩn"
                                className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-600 hover:text-amber-800 border border-stone-200 transition-colors"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleSpeak(opt.id, opt.chinese, true)}
                                title="Nghe phát âm chậm"
                                className="px-1.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-stone-600 hover:text-amber-800 border border-stone-200 text-[10px] font-bold"
                              >
                                🐢
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CORE GRAMMAR PATTERNS */}
          {activeTab === 'grammar' && (
            <div className="space-y-6">
              {CORE_GRAMMAR_RULES.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs hover:border-amber-300 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Mẫu Ngữ Pháp #{idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-stone-900 mt-1">
                        {rule.titleVi}
                      </h3>
                      <p className="text-xs text-amber-800 font-semibold">{rule.titleZh}</p>
                    </div>
                  </div>

                  {/* Formula Box */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-xs sm:text-sm font-sans space-y-1.5">
                    <div className="font-black text-stone-900 text-sm sm:text-base">
                      {rule.formulaZh}
                    </div>
                    {showPinyin && (
                      <div className="text-xs font-bold text-amber-800 font-mono">
                        {rule.formulaPinyin}
                      </div>
                    )}
                    <div className="text-xs text-stone-700 font-medium italic pt-1 border-t border-amber-200/60">
                      👉 {rule.formulaVi}
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <strong className="text-stone-800">Giải thích: </strong>
                    {rule.explanationVi}
                  </p>

                  {/* Examples */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-stone-800 block">
                      Ví dụ thực tế (实用例句):
                    </span>
                    <div className="space-y-2">
                      {rule.examples.map((eg) => (
                        <div
                          key={eg.id}
                          className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-amber-50/50 transition-colors flex items-start justify-between gap-2"
                        >
                          <div>
                            <p className="text-sm font-black text-stone-900">{eg.chinese}</p>
                            {showPinyin && (
                              <p className="text-xs font-bold text-amber-800 mt-0.5">{eg.pinyin}</p>
                            )}
                            <p className="text-xs text-stone-600 mt-1 italic">"{eg.vietnamese}"</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 pt-0.5">
                            <button
                              onClick={() => handleSpeak(eg.id, eg.chinese, false)}
                              title="Nghe chuẩn"
                              className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-amber-800 border border-stone-200"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSpeak(eg.id, eg.chinese, true)}
                              title="Nghe chậm"
                              className="px-1.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-stone-600 border border-stone-200 text-[10px] font-bold"
                            >
                              🐢
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Mẹo: Bấm biểu tượng 🐢 để luyện nghe và nhại theo từng âm tiết tiếng Trung.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Đã hiểu, quay lại Menu
          </button>
        </div>
      </div>
    </div>
  );
};
