import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  Play,
  Square,
  BookOpen,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  PenTool,
  Type,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEXTBOOK_LESSONS, TextbookLesson, TextbookSentence } from '../data/textbookLessons';
import { speakChinese, stopSpeaking } from '../utils/speech';
import { sounds } from '../utils/sound';

interface TextbookLessonViewProps {
  showPinyin: boolean;
  setShowPinyin: (show: boolean) => void;
  showVietnamese: boolean;
  setShowVietnamese: (show: boolean) => void;
  speechRate: number;
  isPenOpen: boolean;
  setIsPenOpen: (open: boolean) => void;
}

const getSpeakerStyle = (speakerZh: string) => {
  switch (speakerZh) {
    case '店员':
      return {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        avatarBg: 'bg-amber-500 text-white',
        cardBorder: 'border-amber-200/80 bg-amber-50/25',
      };
    case '兰兰':
      return {
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        avatarBg: 'bg-rose-500 text-white',
        cardBorder: 'border-stone-200 bg-white',
      };
    case '大卫':
      return {
        badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
        avatarBg: 'bg-teal-600 text-white',
        cardBorder: 'border-stone-200 bg-white',
      };
    default:
      // 小明 / 阿明
      return {
        badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
        avatarBg: 'bg-sky-600 text-white',
        cardBorder: 'border-stone-200 bg-white',
      };
  }
};

export const TextbookLessonView: React.FC<TextbookLessonViewProps> = ({
  showPinyin,
  setShowPinyin,
  showVietnamese,
  setShowVietnamese,
  speechRate,
  isPenOpen,
  setIsPenOpen,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<TextbookLesson>(TEXTBOOK_LESSONS[0]);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);

  // Per-sentence peek state when Vietnamese meaning is globally hidden
  const [peekedSentenceIds, setPeekedSentenceIds] = useState<Record<string, boolean>>({});
  const [peekedVocabIds, setPeekedVocabIds] = useState<Record<string, boolean>>({});

  const playbackSessionRef = useRef<number>(0);

  // Stop audio cleanly on unmount
  useEffect(() => {
    return () => {
      playbackSessionRef.current += 1;
      stopSpeaking();
    };
  }, []);

  // Reset peek states when global Vietnamese is turned back on
  useEffect(() => {
    if (showVietnamese) {
      setPeekedSentenceIds({});
      setPeekedVocabIds({});
    }
  }, [showVietnamese]);

  // Comprehension quiz states
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Stop any sequential loop and read single sentence
  const handlePlaySentence = (sentence: TextbookSentence, slow: boolean = false) => {
    sounds.playTap();
    const sessionId = ++playbackSessionRef.current;
    setIsPlayingAll(false);
    setActiveSentenceId(sentence.id);
    speakChinese(sentence.chinese, slow ? 0.65 : speechRate).then(() => {
      if (playbackSessionRef.current === sessionId) {
        setActiveSentenceId(null);
      }
    });
  };

  // Play full text sequentially with strict cancellation check
  const handlePlayAll = async () => {
    if (isPlayingAll) {
      playbackSessionRef.current += 1;
      stopSpeaking();
      setIsPlayingAll(false);
      setActiveSentenceId(null);
      return;
    }

    const sessionId = ++playbackSessionRef.current;
    setIsPlayingAll(true);

    for (const sent of selectedLesson.sentences) {
      if (playbackSessionRef.current !== sessionId) break;
      setActiveSentenceId(sent.id);

      const completed = await speakChinese(sent.chinese, speechRate);
      if (!completed || playbackSessionRef.current !== sessionId) break;

      await new Promise((r) => setTimeout(r, 600));
      if (playbackSessionRef.current !== sessionId) break;
    }

    if (playbackSessionRef.current === sessionId) {
      setIsPlayingAll(false);
      setActiveSentenceId(null);
    }
  };

  const togglePeekSentence = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playTap();
    setPeekedSentenceIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePeekVocab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sounds.playTap();
    setPeekedVocabIds((prev) => ({ ...prev, [id]: !prev[id] }));
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
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Compact Header + Lesson Switcher */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-2 border border-white/20">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Bài Khóa Thực Hành (课文精读)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {selectedLesson.titleZh}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              {selectedLesson.titleVi} — {selectedLesson.backgroundVi}
            </p>
          </div>

          {/* Lesson Tabs */}
          <div className="flex gap-2 shrink-0">
            {TEXTBOOK_LESSONS.map((lesson, idx) => {
              const isSelected = selectedLesson.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    sounds.playTap();
                    playbackSessionRef.current += 1;
                    stopSpeaking();
                    setIsPlayingAll(false);
                    setActiveSentenceId(null);
                    setSelectedLesson(lesson);
                    setUserAnswers({});
                    setSubmittedQuiz(false);
                    setPeekedSentenceIds({});
                    setPeekedVocabIds({});
                  }}
                  className={`px-4 py-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white text-emerald-950 border-white shadow-md font-black'
                      : 'bg-white/10 text-white hover:bg-white/20 border-white/25 font-semibold'
                  }`}
                >
                  <span className="text-lg">{lesson.coverEmoji}</span>
                  <div>
                    <div className="text-xs sm:text-sm leading-tight">Bài {idx + 1}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-700' : 'text-emerald-200'}`}>
                      {idx === 0 ? 'Trà sữa' : 'Cà phê'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Teaching & Reading Toolbar */}
      <div className="sticky top-[84px] z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Stop All Button */}
          <button
            onClick={handlePlayAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all ${
              isPlayingAll
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlayingAll ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Dừng đọc</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Phát cả bài</span>
              </>
            )}
          </button>

          {/* Toggle Pinyin */}
          <button
            onClick={() => {
              sounds.playTap();
              setShowPinyin(!showPinyin);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showPinyin
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span className="font-mono text-xs">拼</span>
            <span>{showPinyin ? 'Pinyin: Hiện' : 'Pinyin: Ẩn'}</span>
          </button>

          {/* Toggle Vietnamese Meaning */}
          <button
            onClick={() => {
              sounds.playTap();
              setShowVietnamese(!showVietnamese);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showVietnamese
                ? 'bg-sky-50 border-sky-300 text-sky-900'
                : 'bg-stone-900 border-stone-900 text-white shadow-xs'
            }`}
          >
            {showVietnamese ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showVietnamese ? 'Nghĩa Việt: Hiện' : 'Nghĩa Việt: Đang ẩn'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size Toggle for Classroom / Projector */}
          <button
            onClick={() => {
              sounds.playTap();
              setLargeTextMode(!largeTextMode);
            }}
            title="Phóng to chữ Hán để trình chiếu trên lớp"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              largeTextMode
                ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{largeTextMode ? 'Cỡ chữ: Lớn' : 'Cỡ chữ: Chuẩn'}</span>
          </button>

          {/* Teacher Pen Quick Toggle */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsPenOpen(!isPenOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isPenOpen
                ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{isPenOpen ? 'Đang bật bút' : 'Bút viết GV'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: KEY VOCABULARY FIRST (Standard Textbook Flow: 生词 before 课文) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
            <span>📝</span>
            <span>Từ Mới Trọng Tâm (生词)</span>
          </h3>
          <span className="text-xs text-stone-500">Bấm vào thẻ từ để nghe phát âm</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {selectedLesson.vocabulary.map((vocab) => {
            const isViVisible = showVietnamese || peekedVocabIds[vocab.id];
            return (
              <div
                key={vocab.id}
                onClick={() => {
                  sounds.playTap();
                  playbackSessionRef.current += 1;
                  setIsPlayingAll(false);
                  setActiveSentenceId(null);
                  speakChinese(vocab.chinese, speechRate);
                }}
                className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-all flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-600 mb-1">
                      {vocab.partOfSpeech}
                    </span>
                    <div className={`font-black text-stone-900 ${largeTextMode ? 'text-2xl' : 'text-xl'}`}>
                      {vocab.chinese}
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
                </div>

                <div className="space-y-1">
                  {showPinyin && (
                    <div className="text-xs sm:text-sm font-bold text-amber-700">{vocab.pinyin}</div>
                  )}

                  {isViVisible ? (
                    <div className="text-xs sm:text-sm font-medium text-stone-700">
                      {vocab.vietnamese}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => togglePeekVocab(e, vocab.id)}
                      className="text-[11px] font-semibold text-stone-400 hover:text-amber-700 flex items-center gap-1 pt-0.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem nghĩa</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CLEAN TEXTBOOK DIALOGUE SCRIPT */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-black text-base sm:text-lg text-stone-900 flex items-center gap-2">
            <span>🗣️</span>
            <span>Nội Dung Bài Khóa (课文对话)</span>
          </h3>
          <span className="text-xs text-stone-500">
            {selectedLesson.sentences.length} câu • Bấm từng câu để nghe
          </span>
        </div>

        <div className="divide-y divide-stone-100 space-y-3">
          {selectedLesson.sentences.map((sent, index) => {
            const isActive = activeSentenceId === sent.id;
            const style = getSpeakerStyle(sent.speakerZh);
            const isViVisible = showVietnamese || peekedSentenceIds[sent.id];

            return (
              <div
                key={sent.id}
                onClick={() => handlePlaySentence(sent, false)}
                className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isActive
                    ? 'border-amber-500 bg-amber-50/90 ring-4 ring-amber-500/15 shadow-sm'
                    : `${style.cardBorder} hover:border-amber-300 hover:bg-stone-50/70`
                }`}
              >
                {/* Top row: Line number + Speaker + Audio controls */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-black text-stone-400 w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-2xs ${style.avatarBg}`}
                    >
                      {sent.avatar}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${style.badgeBg}`}
                    >
                      {sent.speakerZh} • {sent.speakerVi}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!showVietnamese && (
                      <button
                        type="button"
                        onClick={(e) => togglePeekSentence(e, sent.id)}
                        title="Hiện/Ẩn tạm nghĩa câu này"
                        className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-sky-100 text-[11px] font-semibold text-stone-600 hover:text-sky-800 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {peekedSentenceIds[sent.id] ? 'Ẩn' : 'Nghĩa'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySentence(sent, false);
                      }}
                      title="Nghe tốc độ chuẩn"
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        isActive
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900'
                      }`}
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                      <span className="hidden sm:inline">Nghe</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySentence(sent, true);
                      }}
                      title="Nghe chậm 0.65x"
                      className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-xs font-bold text-stone-700"
                    >
                      🐢
                    </button>
                  </div>
                </div>

                {/* Main Text Content with clean left indent aligned to speaker badge */}
                <div className="pl-8 sm:pl-9 space-y-1.5">
                  {/* Chinese characters - high contrast, generous spacing */}
                  <p
                    className={`font-black text-stone-900 tracking-wide leading-relaxed ${
                      largeTextMode ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                    }`}
                  >
                    {sent.chinese}
                  </p>

                  {/* Pinyin */}
                  {showPinyin && (
                    <p
                      className={`font-semibold text-amber-800 tracking-wide ${
                        largeTextMode ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                      }`}
                    >
                      {sent.pinyin}
                    </p>
                  )}

                  {/* Vietnamese translation */}
                  {isViVisible && (
                    <p
                      className={`text-stone-600 pt-1.5 border-t border-stone-200/70 ${
                        largeTextMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                      }`}
                    >
                      {sent.vietnamese}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: COMPREHENSION QUIZ */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Kiểm tra đọc hiểu
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
            <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <div>
                  <h4
                    className={`font-black text-stone-900 ${
                      largeTextMode ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                    }`}
                  >
                    {q.questionZh}
                  </h4>
                  {showVietnamese && (
                    <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{q.questionVi}</p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {q.options.map((opt) => {
                  const isSelected = userAnswers[q.id] === opt.id;
                  let optStyle = 'border-stone-200 bg-white hover:border-amber-300 text-stone-800';

                  if (submittedQuiz) {
                    if (opt.isCorrect) {
                      optStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 font-bold';
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
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <div>
                        <div className={`font-bold ${largeTextMode ? 'text-base' : 'text-sm'}`}>
                          {opt.textZh}
                        </div>
                        {showVietnamese && (
                          <div className="text-[11px] opacity-80 mt-0.5">{opt.textVi}</div>
                        )}
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
