import React, { useState } from 'react';
import { Volume2, Play, Square, BookOpen, CheckCircle2, XCircle, Sparkles, HelpCircle, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEXTBOOK_LESSONS, TextbookLesson, TextbookSentence } from '../data/textbookLessons';
import { speakChinese, stopSpeaking } from '../utils/speech';
import { sounds } from '../utils/sound';

interface TextbookLessonViewProps {
  showPinyin: boolean;
  speechRate: number;
}

export const TextbookLessonView: React.FC<TextbookLessonViewProps> = ({ showPinyin, speechRate }) => {
  const [selectedLesson, setSelectedLesson] = useState<TextbookLesson>(TEXTBOOK_LESSONS[0]);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);

  // Comprehension quiz states
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Read single sentence
  const handlePlaySentence = (sentence: TextbookSentence, slow: boolean = false) => {
    sounds.playTap();
    setActiveSentenceId(sentence.id);
    speakChinese(sentence.chinese, slow ? 0.65 : speechRate).then(() => {
      setActiveSentenceId(null);
    });
  };

  // Play full text sequentially
  const handlePlayAll = async () => {
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      setActiveSentenceId(null);
      return;
    }

    setIsPlayingAll(true);
    for (const sent of selectedLesson.sentences) {
      setActiveSentenceId(sent.id);
      await speakChinese(sent.chinese, speechRate);
      await new Promise((r) => setTimeout(r, 650));
    }
    setIsPlayingAll(false);
    setActiveSentenceId(null);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submittedQuiz) return;
    sounds.playTap();
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleCheckQuiz = () => {
    sounds.playCashRegister();
    setSubmittedQuiz(true);

    const isAllCorrect = selectedLesson.comprehensionQuestions.every(
      (q) => userAnswers[q.id] && q.options.find((o) => o.id === userAnswers[q.id])?.isCorrect
    );

    if (isAllCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    sounds.playTap();
    setUserAnswers({});
    setSubmittedQuiz(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Bài Khóa Thực Tế (课文精读)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bài Khóa: Hội Thoại Gọi Đồ Uống Tiếng Trung
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Luyện đọc hội thoại tự nhiên, trau dồi ngữ điệu, ghi nhớ từ vựng và trả lời câu hỏi đọc hiểu để nhớ bài sâu hơn!
          </p>

          {/* Quick controls */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={handlePlayAll}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                isPlayingAll
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-white hover:bg-emerald-50 text-emerald-950'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Dừng đọc bài khóa</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Phát toàn bộ bài khóa</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              {showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranslation ? 'Ẩn bản dịch tiếng Việt' : 'Hiện bản dịch tiếng Việt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {TEXTBOOK_LESSONS.map((lesson) => {
          const isSelected = selectedLesson.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => {
                sounds.playTap();
                stopSpeaking();
                setIsPlayingAll(false);
                setActiveSentenceId(null);
                setSelectedLesson(lesson);
                setUserAnswers({});
                setSubmittedQuiz(false);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all shrink-0 min-w-[240px] ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{lesson.coverEmoji}</span>
                <div>
                  <h4 className="font-black text-sm">{lesson.titleVi}</h4>
                  <p className={`text-xs ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                    {lesson.titleZh}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Background Story Description */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-stone-700">
        <span className="font-bold text-amber-900">Bối cảnh bài khóa: </span>
        <span>{selectedLesson.backgroundVi}</span>
      </div>

      {/* Main Conversation Flow */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
            <span>🗣️</span>
            <span>Nội Dung Bài Khóa Đối Thoại</span>
          </h3>
          <span className="text-xs text-stone-400">Bấm vào câu bất kỳ để nghe phát âm</span>
        </div>

        <div className="space-y-3.5">
          {selectedLesson.sentences.map((sent) => {
            const isActive = activeSentenceId === sent.id;
            const isCashier = sent.speakerZh === '店员';

            return (
              <div
                key={sent.id}
                onClick={() => handlePlaySentence(sent, false)}
                className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isActive
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-xs scale-[1.01]'
                    : isCashier
                    ? 'border-amber-200/70 bg-amber-50/30 hover:bg-amber-50/60'
                    : 'border-stone-200/80 bg-white hover:bg-stone-50'
                }`}
              >
                {/* Speaker Avatar */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs ${
                    isCashier ? 'bg-amber-500 text-white' : 'bg-teal-500 text-white'
                  }`}
                >
                  {sent.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-stone-800">
                      {sent.speakerZh} ({sent.speakerVi})
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySentence(sent, false);
                        }}
                        title="Nghe chuẩn"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySentence(sent, true);
                        }}
                        title="Nghe chậm"
                        className="px-1.5 py-0.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-[10px] font-bold text-stone-600"
                      >
                        🐢
                      </button>
                    </div>
                  </div>

                  {/* Chinese Sentence */}
                  <p className="text-base sm:text-lg font-black text-stone-900 tracking-wide font-sans leading-relaxed">
                    {sent.chinese}
                  </p>

                  {/* Pinyin */}
                  {showPinyin && (
                    <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-0.5">
                      {sent.pinyin}
                    </p>
                  )}

                  {/* Vietnamese translation */}
                  {showTranslation && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 italic">
                      "{sent.vietnamese}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vocabulary in Lesson (Từ mới) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-3">
        <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
          <span>📝</span>
          <span>Từ Mới Trọng Tâm Trong Bài Khóa (生词)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {selectedLesson.vocabulary.map((vocab) => (
            <div
              key={vocab.id}
              onClick={() => {
                sounds.playTap();
                speakChinese(vocab.chinese, speechRate);
              }}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-base font-black text-stone-900">{vocab.chinese}</div>
                {showPinyin && <div className="text-xs font-semibold text-amber-700">{vocab.pinyin}</div>}
                <div className="text-xs text-stone-600 mt-0.5">{vocab.vietnamese}</div>
              </div>
              <Volume2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Comprehension Quiz (Câu hỏi đọc hiểu) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Kiểm tra nhanh
            </span>
            <h3 className="font-black text-base sm:text-lg text-stone-900 mt-1">
              Câu Hỏi Đọc Hiểu Bài Khóa (阅读理解)
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {selectedLesson.comprehensionQuestions.length} câu hỏi
          </span>
        </div>

        <div className="space-y-4">
          {selectedLesson.comprehensionQuestions.map((q, qIdx) => (
            <div key={q.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-lg bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {qIdx + 1}
                </span>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-stone-900">{q.questionZh}</h4>
                  <p className="text-xs text-stone-600 italic">{q.questionVi}</p>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = userAnswers[q.id] === opt.id;
                  let optStyle = 'border-stone-200 bg-white hover:border-amber-300 text-stone-800';

                  if (submittedQuiz) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
                    } else {
                      optStyle = 'border-stone-200 bg-stone-100 text-stone-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submittedQuiz}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <div>
                        <div className="font-bold text-sm">{opt.textZh}</div>
                        <div className="text-[11px] opacity-80">{opt.textVi}</div>
                      </div>
                      {submittedQuiz && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submittedQuiz && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation when submitted */}
              {submittedQuiz && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-stone-700 animate-in fade-in">
                  <span className="font-bold text-amber-900">Giải thích: </span>
                  <span>{q.explanationVi}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {!submittedQuiz ? (
            <button
              onClick={handleCheckQuiz}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kiểm Tra Đáp Án Đọc Hiểu</span>
            </button>
          ) : (
            <button
              onClick={handleResetQuiz}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Làm Lại Trắc Nghiệm</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
