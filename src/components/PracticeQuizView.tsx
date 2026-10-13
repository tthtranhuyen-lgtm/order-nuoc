import React, { useState } from 'react';
import { Volume2, Award, RotateCcw, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRACTICE_QUIZZES } from '../data/quizzes';
import { QuizQuestion } from '../types/menu';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface PracticeQuizViewProps {
  showPinyin: boolean;
  speechRate: number;
}

export const PracticeQuizView: React.FC<PracticeQuizViewProps> = ({ showPinyin, speechRate }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // For sentence ordering puzzle
  const [orderedWordIds, setOrderedWordIds] = useState<string[]>([]);

  const question = PRACTICE_QUIZZES[currentIdx];

  const handlePlayAudio = (text: string) => {
    sounds.playTap();
    speakChinese(text, speechRate);
  };

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 10);
    } else {
      sounds.playError();
    }
  };

  // Puzzle word click
  const handleToggleWord = (wordId: string) => {
    sounds.playTap();
    if (orderedWordIds.includes(wordId)) {
      setOrderedWordIds((prev) => prev.filter((id) => id !== wordId));
    } else {
      setOrderedWordIds((prev) => [...prev, wordId]);
    }
  };

  // Submit sentence puzzle
  const handleCheckSentence = () => {
    if (!question.correctOrder || isAnswered) return;
    setIsAnswered(true);
    const isCorrect =
      orderedWordIds.length === question.correctOrder.length &&
      orderedWordIds.every((id, idx) => id === question.correctOrder![idx]);

    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 15);
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    sounds.playTap();
    setSelectedOptionId(null);
    setIsAnswered(false);
    setOrderedWordIds([]);

    if (currentIdx + 1 < PRACTICE_QUIZZES.length) {
      setCurrentIdx((c) => c + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setOrderedWordIds([]);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header & Progress */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md">
            🎯
          </div>
          <div>
            <h3 className="font-black text-lg text-stone-900">
              Luyện Tập & Thử Thách Gọi Nước
            </h3>
            <p className="text-xs text-stone-500">
              Câu hỏi {currentIdx + 1} / {PRACTICE_QUIZZES.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="text-2xl font-black text-amber-700">{score}</span>
          <span className="text-xs text-stone-400">điểm</span>
        </div>
      </div>

      {isFinished ? (
        // Results Card
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto shadow-inner">
            🏆
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Chúc Mừng! (太棒了!)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-3">
              Bạn Đã Hoàn Thành Thử Thách!
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Điểm số của bạn: <span className="font-black text-amber-700 text-xl">{score}</span> điểm
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-md mx-auto text-xs text-stone-600 leading-relaxed text-left space-y-1.5">
            <p className="font-bold text-stone-800">💡 Nhận xét từ giáo viên:</p>
            <p>
              Bạn đã nắm vững tên các loại đồ uống bằng tiếng Trung (蜂蜜柠檬茶, 芝士奶盖绿茶, 薄荷可可, 越南白咖啡, 蜜桃茶, 冰炼乳咖啡, 牛油果冰沙, 西瓜汁, 橙汁, 抹茶拿铁) cũng như cách chọn độ ngọt (甜度) và lượng đá (冰度).
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Luyện Tập Lại Từ Đầu</span>
          </button>
        </div>
      ) : (
        // Question Card
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Question Prompt */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                {question.type === 'listen' ? '🎧 Nghe Phát Âm' : question.type === 'hanzi' ? '📖 Nhận Diện Chữ Hán' : '🧩 Xếp Câu Gọi Món'}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {question.prompt}
            </h4>
          </div>

          {/* Special Type UI: Listen Question */}
          {question.type === 'listen' && question.audioZh && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center flex flex-col items-center justify-center gap-3">
              <button
                onClick={() => handlePlayAudio(question.audioZh!)}
                className="w-16 h-16 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-600/30 transition-transform active:scale-95"
              >
                <Volume2 className="w-8 h-8" />
              </button>
              <div className="text-xs font-semibold text-amber-900">
                Bấm nút để nghe phát âm tiếng Trung
              </div>
            </div>
          )}

          {/* Special Type UI: Hanzi prompt */}
          {question.type === 'hanzi' && (
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-wider">
                {question.promptZh}
              </span>
            </div>
          )}

          {/* Options for Choice Questions */}
          {question.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = 'border-stone-200 bg-white hover:border-amber-300 text-stone-800';

                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
                  } else {
                    btnStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex items-start justify-between ${btnStyle}`}
                  >
                    <div>
                      {opt.textZh && (
                        <div className="text-base font-black text-stone-900">{opt.textZh}</div>
                      )}
                      {showPinyin && opt.pinyin && (
                        <div className="text-xs font-semibold text-amber-800 mt-0.5">{opt.pinyin}</div>
                      )}
                      <div className="text-sm font-medium mt-0.5">{opt.text}</div>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0 ml-2">
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Special UI: Sentence Ordering Puzzle */}
          {question.type === 'order_sentence' && question.scrambledWords && (
            <div className="space-y-4">
              {/* Construction target zone */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300 min-h-[70px] flex flex-wrap items-center gap-2">
                {orderedWordIds.length === 0 ? (
                  <span className="text-xs text-amber-800/60 italic">
                    Bấm vào các từ bên dưới theo thứ tự để xếp câu...
                  </span>
                ) : (
                  orderedWordIds.map((id) => {
                    const item = question.scrambledWords?.find((w) => w.id === id);
                    if (!item) return null;
                    return (
                      <button
                        key={id}
                        disabled={isAnswered}
                        onClick={() => handleToggleWord(id)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-sm shadow-xs flex items-center gap-1.5"
                      >
                        <span>{item.wordZh}</span>
                        {showPinyin && (
                          <span className="text-[10px] text-amber-200">({item.pinyin})</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Scrambled word bank */}
              <div className="flex flex-wrap gap-2">
                {question.scrambledWords.map((item) => {
                  const isUsed = orderedWordIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      disabled={isAnswered || isUsed}
                      onClick={() => handleToggleWord(item.id)}
                      className={`px-3.5 py-2 rounded-xl border text-sm font-bold transition-all ${
                        isUsed
                          ? 'border-stone-200 bg-stone-100 text-stone-300'
                          : 'border-stone-300 bg-white hover:border-amber-400 text-stone-800 shadow-xs'
                      }`}
                    >
                      <div>{item.wordZh}</div>
                      <div className="text-[10px] font-normal text-stone-500">{item.meaningVi}</div>
                    </button>
                  );
                })}
              </div>

              {!isAnswered && (
                <button
                  onClick={handleCheckSentence}
                  disabled={orderedWordIds.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm"
                >
                  Kiểm tra câu vừa xếp
                </button>
              )}
            </div>
          )}

          {/* Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-1.5 animate-in fade-in">
              <span className="font-bold text-stone-900">Giải thích: </span>
              <p>{question.explanationVi}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <span>{currentIdx + 1 < PRACTICE_QUIZZES.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
