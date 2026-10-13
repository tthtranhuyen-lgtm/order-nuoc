import React, { useState } from 'react';
import { Volume2, Sparkles, Heart, Star, Coffee, ThumbsDown, MessageCircle } from 'lucide-react';
import { DrinkItem } from '../types/menu';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

export type PreferenceType = 'like' | 'favorite' | 'want' | 'dislike';

interface LessonHeaderProps {
  currentDrink: DrinkItem | null;
  preferenceType: PreferenceType;
  setPreferenceType: (type: PreferenceType) => void;
  showPinyin: boolean;
  speechRate: number;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentDrink,
  preferenceType,
  setPreferenceType,
  showPinyin,
  speechRate,
}) => {
  const [isSpeakingTeacher, setIsSpeakingTeacher] = useState(false);
  const [isSpeakingStudent, setIsSpeakingStudent] = useState(false);

  // 4 Types of questions & sentence patterns
  const patterns: Record<
    PreferenceType,
    {
      label: string;
      icon: React.ReactNode;
      questionZh: string;
      questionPinyin: string;
      questionVi: string;
      prefixZh: string;
      prefixPinyin: string;
      prefixVi: string;
      colorClass: string;
    }
  > = {
    like: {
      label: '1. Thích (喜欢)',
      icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />,
      questionZh: '你喜欢喝什么？',
      questionPinyin: 'Nǐ xǐhuān hē shénme?',
      questionVi: 'Bạn thích uống gì?',
      prefixZh: '我喜欢喝',
      prefixPinyin: 'Wǒ xǐhuān hē ',
      prefixVi: 'Tôi thích uống ',
      colorClass: 'border-rose-400 bg-rose-50/70 text-rose-900',
    },
    favorite: {
      label: '2. Thích nhất (最喜欢)',
      icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />,
      questionZh: '你最喜欢喝什么？',
      questionPinyin: 'Nǐ zuì xǐhuān hē shénme?',
      questionVi: 'Bạn thích uống gì nhất?',
      prefixZh: '我最喜欢喝',
      prefixPinyin: 'Wǒ zuì xǐhuān hē ',
      prefixVi: 'Tôi thích uống nhất là ',
      colorClass: 'border-amber-400 bg-amber-50/70 text-amber-900',
    },
    want: {
      label: '3. Muốn uống (想喝/要)',
      icon: <Coffee className="w-4 h-4 text-emerald-500" />,
      questionZh: '今天你想喝什么？',
      questionPinyin: 'Jīntiān nǐ xiǎng hē shénme?',
      questionVi: 'Hôm nay bạn muốn uống gì?',
      prefixZh: '我想喝一杯',
      prefixPinyin: 'Wǒ xiǎng hē yī bēi ',
      prefixVi: 'Tôi muốn uống 1 ly ',
      colorClass: 'border-emerald-400 bg-emerald-50/70 text-emerald-900',
    },
    dislike: {
      label: '4. Không thích (不喜欢)',
      icon: <ThumbsDown className="w-4 h-4 text-stone-500" />,
      questionZh: '你不喜欢喝什么？',
      questionPinyin: 'Nǐ bù xǐhuān hē shénme?',
      questionVi: 'Bạn không thích uống món gì?',
      prefixZh: '我不喜欢喝',
      prefixPinyin: 'Wǒ bù xǐhuān hē ',
      prefixVi: 'Tôi không thích uống ',
      colorClass: 'border-stone-400 bg-stone-100/80 text-stone-900',
    },
  };

  const activePattern = patterns[preferenceType];

  // Selected drink sentence or placeholder
  const studentAnswerZh = currentDrink
    ? `${activePattern.prefixZh}${currentDrink.primaryZh}。`
    : `${activePattern.prefixZh}...（Bấm chọn món bên dưới）`;

  const studentAnswerPinyin = currentDrink
    ? `${activePattern.prefixPinyin}${currentDrink.pinyin}.`
    : `${activePattern.prefixPinyin}[tên đồ uống]`;

  const studentAnswerVi = currentDrink
    ? `${activePattern.prefixVi}${currentDrink.nameVi}.`
    : `${activePattern.prefixVi}[bấm chọn món bên dưới]`;

  // Teacher asks question audio
  const handleTeacherAsk = () => {
    sounds.playTap();
    setIsSpeakingTeacher(true);
    speakChinese(activePattern.questionZh, speechRate).then(() => {
      setIsSpeakingTeacher(false);
    });
  };

  // Student answers audio
  const handleStudentAnswer = (slow: boolean = false) => {
    if (!currentDrink) {
      // Prompt user to select drink
      handleTeacherAsk();
      return;
    }
    sounds.playTap();
    setIsSpeakingStudent(true);
    speakChinese(studentAnswerZh, slow ? 0.65 : speechRate).then(() => {
      setIsSpeakingStudent(false);
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-md space-y-5">
      {/* Lesson Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1.5 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Chủ Đề Hôm Nay: Cách Nói Thích Đồ Uống Gì</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            今天学习：如何表达喜欢喝什么？
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Chọn mẫu câu bên dưới, sau đó bấm vào hình đồ uống trong menu để nghe và luyện nói câu hoàn chỉnh!
          </p>
        </div>

        {/* Pattern Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(Object.keys(patterns) as PreferenceType[]).map((key) => {
            const p = patterns[key];
            const isSelected = preferenceType === key;
            return (
              <button
                key={key}
                onClick={() => {
                  sounds.playTap();
                  setPreferenceType(key);
                }}
                className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Dialogue Practice Box (Hỏi & Trả lời trực tiếp) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Câu Hỏi (Cô giáo / Bạn hỏi) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                  问
                </span>
                <span>Người hỏi (Câu hỏi mẫu)</span>
              </span>
              <button
                onClick={handleTeacherAsk}
                disabled={isSpeakingTeacher}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeakingTeacher ? 'Đang hỏi...' : 'Nghe câu hỏi'}</span>
              </button>
            </div>

            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-stone-900 tracking-wide font-sans">
                {activePattern.questionZh}
              </p>
              {showPinyin && (
                <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                  {activePattern.questionPinyin}
                </p>
              )}
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium italic">
                "{activePattern.questionVi}"
              </p>
            </div>
          </div>
        </div>

        {/* 2. Câu Trả Lời (Học sinh thực hành khi bấm vào món) */}
        <div className={`p-4 sm:p-5 rounded-2xl border-2 ${activePattern.colorClass} flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">
                  答
                </span>
                <span>Bạn trả lời (Bấm vào món để ghép)</span>
              </span>

              {currentDrink && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStudentAnswer(false)}
                    disabled={isSpeakingStudent}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeakingStudent ? 'Đang đọc...' : 'Nghe câu trả lời'}</span>
                  </button>
                  <button
                    onClick={() => handleStudentAnswer(true)}
                    title="Nghe tốc độ chậm để luyện phát âm từng âm tiết"
                    className="px-2 py-1 rounded-lg bg-white/80 hover:bg-white text-stone-700 text-xs font-semibold border border-stone-300"
                  >
                    🐢 Chậm
                  </button>
                </div>
              )}
            </div>

            <div className="mt-2">
              <p className="text-xl sm:text-2xl font-black text-stone-900 tracking-wide font-sans leading-relaxed">
                {studentAnswerZh}
              </p>
              {showPinyin && (
                <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                  {studentAnswerPinyin}
                </p>
              )}
              <p className="text-xs sm:text-sm text-stone-700 mt-1 font-semibold italic">
                "{studentAnswerVi}"
              </p>
            </div>
          </div>

          {!currentDrink && (
            <div className="mt-3 text-[11px] text-stone-500 font-medium flex items-center gap-1">
              <span>👉</span>
              <span>Bấm vào bất kỳ món nước bên dưới để điền tên vào câu trả lời nhé!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
