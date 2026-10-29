import React, { useState, useEffect } from 'react';
import { Volume2, Award, RotateCcw, CheckCircle2, Sparkles, Trophy, Shuffle, Play, Timer, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DRINKS_DATA } from '../data/drinks';
import { DrinkItem } from '../types/menu';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface GamesViewProps {
  showPinyin: boolean;
  speechRate: number;
}

type GameMode = 'memory' | 'listening' | 'sentence';

interface MemoryCard {
  uniqueId: string;
  drinkId: string;
  type: 'image' | 'hanzi';
  drink: DrinkItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export const GamesView: React.FC<GamesViewProps> = ({ showPinyin, speechRate }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('memory');

  /* -------------------------------------------
   * GAME 1: MEMORY MATCHING (LẬT THẺ GHI NHỚ)
   * ------------------------------------------- */
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [isMemoryWon, setIsMemoryWon] = useState(false);

  // Initialize Memory Game with 6 random drinks (12 cards total)
  const initMemoryGame = () => {
    sounds.playTap();
    // Pick 6 random drinks from the 10
    const shuffledDrinks = [...DRINKS_DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
    const cards: MemoryCard[] = [];

    shuffledDrinks.forEach((drink) => {
      // Card 1: Image & Vietnamese name
      cards.push({
        uniqueId: `${drink.id}_img`,
        drinkId: drink.id,
        type: 'image',
        drink,
        isFlipped: false,
        isMatched: false,
      });
      // Card 2: Hanzi & Pinyin
      cards.push({
        uniqueId: `${drink.id}_hanzi`,
        drinkId: drink.id,
        type: 'hanzi',
        drink,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the 12 cards
    const randomized = cards.sort(() => 0.5 - Math.random());
    setMemoryCards(randomized);
    setFlippedCardIds([]);
    setMovesCount(0);
    setMatchCount(0);
    setIsMemoryWon(false);
  };

  useEffect(() => {
    if (activeGame === 'memory') {
      initMemoryGame();
    }
  }, [activeGame]);

  const handleCardClick = (card: MemoryCard) => {
    if (card.isFlipped || card.isMatched || flippedCardIds.length === 2) return;

    sounds.playTap();
    const newFlipped = [...flippedCardIds, card.uniqueId];
    setFlippedCardIds(newFlipped);

    // Speak Chinese when flipping Hanzi card
    if (card.type === 'hanzi') {
      speakChinese(card.drink.primaryZh, speechRate);
    }

    // Update flipped state
    setMemoryCards((prev) =>
      prev.map((c) => (c.uniqueId === card.uniqueId ? { ...c, isFlipped: true } : c))
    );

    // If 2 cards are now flipped, check match
    if (newFlipped.length === 2) {
      setMovesCount((m) => m + 1);
      const firstCard = memoryCards.find((c) => c.uniqueId === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.drinkId === secondCard.drinkId) {
        // MATCH!
        sounds.playSuccess();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.drinkId === secondCard.drinkId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCardIds([]);
          const newMatch = matchCount + 1;
          setMatchCount(newMatch);

          if (newMatch === 6) {
            setIsMemoryWon(true);
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
            speakChinese('太棒了，你全部记住了！', 0.9);
          }
        }, 500);
      } else {
        // NOT MATCH - flip back after delay
        sounds.playError();
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.uniqueId) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCardIds([]);
        }, 1100);
      }
    }
  };

  /* -------------------------------------------
   * GAME 2: LISTENING QUIZ (NGHE ĐOÁN MÓN)
   * ------------------------------------------- */
  const [listenRound, setListenRound] = useState(0);
  const [targetDrink, setTargetDrink] = useState<DrinkItem>(DRINKS_DATA[0]);
  const [listenOptions, setListenOptions] = useState<DrinkItem[]>([]);
  const [listenScore, setListenScore] = useState(0);
  const [listenStreak, setListenStreak] = useState(0);
  const [selectedListenId, setSelectedListenId] = useState<string | null>(null);
  const [listenAnswered, setListenAnswered] = useState(false);

  const initListenRound = (drinks = DRINKS_DATA) => {
    const randomTarget = drinks[Math.floor(Math.random() * drinks.length)];
    const otherDrinks = drinks.filter((d) => d.id !== randomTarget.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [randomTarget, ...otherDrinks].sort(() => 0.5 - Math.random());

    setTargetDrink(randomTarget);
    setListenOptions(options);
    setSelectedListenId(null);
    setListenAnswered(false);

    // Auto play target audio
    setTimeout(() => {
      speakChinese(randomTarget.primaryZh, speechRate);
    }, 400);
  };

  useEffect(() => {
    if (activeGame === 'listening') {
      setListenScore(0);
      setListenStreak(0);
      setListenRound(1);
      initListenRound();
    }
  }, [activeGame]);

  const handlePickListenOption = (drink: DrinkItem) => {
    if (listenAnswered) return;
    setSelectedListenId(drink.id);
    setListenAnswered(true);

    if (drink.id === targetDrink.id) {
      sounds.playSuccess();
      setListenScore((s) => s + 10);
      setListenStreak((st) => st + 1);
    } else {
      sounds.playError();
      setListenStreak(0);
    }
  };

  const handleNextListen = () => {
    sounds.playTap();
    setListenRound((r) => r + 1);
    initListenRound();
  };

  /* -------------------------------------------
   * GAME 3: WORD SCRAMBLE ORDER SENTENCE
   * ------------------------------------------- */
  const sentencePuzzles = [
    {
      id: 'p1',
      meaningVi: 'Tôi muốn 1 ly trà chanh mật ong size lớn, 50% đường, ít đá, mang về.',
      targetSentence: '我要一杯大杯蜂蜜柠檬茶，半糖，少冰，打包。',
      words: [
        { id: 'w1', zh: '我要一杯', py: 'wǒ yào yī bēi', vi: 'Tôi muốn 1 ly' },
        { id: 'w2', zh: '大杯', py: 'dà bēi', vi: 'size lớn' },
        { id: 'w3', zh: '蜂蜜柠檬茶', py: 'fēngmì níngméngchá', vi: 'trà chanh mật ong' },
        { id: 'w4', zh: '半糖', py: 'bàn táng', vi: '50% đường' },
        { id: 'w5', zh: '少冰', py: 'shǎo bīng', vi: 'ít đá' },
        { id: 'w6', zh: '打包', py: 'dǎ bāo', vi: 'mang về' },
      ],
      correctOrder: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'],
    },
    {
      id: 'p2',
      meaningVi: 'Cho tôi một ly trà xanh kem cheese, 70% đường, không đá, thêm trân châu.',
      targetSentence: '给我来一杯芝士奶盖绿茶，少糖，去冰，加珍珠。',
      words: [
        { id: 'pw1', zh: '给我来一杯', py: 'gěi wǒ lái yī bēi', vi: 'Cho tôi một ly' },
        { id: 'pw2', zh: '芝士奶盖绿茶', py: 'zhīshì nǎigài lǜchá', vi: 'trà xanh kem cheese' },
        { id: 'pw3', zh: '少糖', py: 'shǎo táng', vi: '70% đường' },
        { id: 'pw4', zh: '去冰', py: 'qù bīng', vi: 'không đá' },
        { id: 'pw5', zh: '加珍珠', py: 'jiā zhēnzhū', vi: 'thêm trân châu' },
      ],
      correctOrder: ['pw1', 'pw2', 'pw3', 'pw4', 'pw5'],
    },
    {
      id: 'p3',
      meaningVi: 'Tôi muốn uống 1 ly bạc xỉu nóng, ít đường, uống tại quán.',
      targetSentence: '我想喝一杯越南白咖啡，微糖，热，堂食。',
      words: [
        { id: 'pw3_1', zh: '我想喝一杯', py: 'wǒ xiǎng hē yī bēi', vi: 'Tôi muốn uống 1 ly' },
        { id: 'pw3_2', zh: '越南白咖啡', py: 'Yuènán bái kāfēi', vi: 'bạc xỉu' },
        { id: 'pw3_3', zh: '微糖', py: 'wēi táng', vi: '30% đường' },
        { id: 'pw3_4', zh: '热', py: 'rè', vi: 'nóng' },
        { id: 'pw3_5', zh: '堂食', py: 'táng shí', vi: 'uống tại quán' },
      ],
      correctOrder: ['pw3_1', 'pw3_2', 'pw3_3', 'pw3_4', 'pw3_5'],
    },
  ];

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [scrambleAnswered, setScrambleAnswered] = useState(false);
  const [scrambleCorrect, setScrambleCorrect] = useState(false);

  const currentPuzzle = sentencePuzzles[puzzleIdx];
  const [shuffledWordList, setShuffledWordList] = useState(currentPuzzle.words);

  useEffect(() => {
    setShuffledWordList([...currentPuzzle.words].sort(() => 0.5 - Math.random()));
    setSelectedWordIds([]);
    setScrambleAnswered(false);
    setScrambleCorrect(false);
  }, [puzzleIdx]);

  const handleTogglePuzzleWord = (wordId: string) => {
    if (scrambleAnswered) return;
    sounds.playTap();
    if (selectedWordIds.includes(wordId)) {
      setSelectedWordIds((prev) => prev.filter((id) => id !== wordId));
    } else {
      setSelectedWordIds((prev) => [...prev, wordId]);
    }
  };

  const handleCheckSentence = () => {
    setScrambleAnswered(true);
    const isCorrect =
      selectedWordIds.length === currentPuzzle.correctOrder.length &&
      selectedWordIds.every((id, idx) => id === currentPuzzle.correctOrder[idx]);

    setScrambleCorrect(isCorrect);
    if (isCorrect) {
      sounds.playSuccess();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      speakChinese(currentPuzzle.targetSentence, speechRate);
    } else {
      sounds.playError();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trò Chơi Học Tập (互动游戏)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Vừa Chơi Vừa Nhớ Tên Món & Mẫu Câu Order
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Chọn một trò chơi bên dưới để thử thách trí nhớ về mặt chữ Hán, phát âm và phản xạ gọi đồ uống bằng tiếng Trung!
          </p>
        </div>
      </div>

      {/* Game Mode Switcher */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => {
            sounds.playTap();
            setActiveGame('memory');
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
            activeGame === 'memory'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20 font-bold'
              : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
          }`}
        >
          <span className="text-2xl">🃏</span>
          <span className="text-xs sm:text-sm font-black">1. Lật Thẻ Ghi Nhớ</span>
          <span className={`text-[10px] ${activeGame === 'memory' ? 'text-amber-100' : 'text-stone-400'}`}>
            Ghép hình & Chữ Hán
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setActiveGame('listening');
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
            activeGame === 'listening'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20 font-bold'
              : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
          }`}
        >
          <span className="text-2xl">🎧</span>
          <span className="text-xs sm:text-sm font-black">2. Nghe Đoán Món</span>
          <span className={`text-[10px] ${activeGame === 'listening' ? 'text-amber-100' : 'text-stone-400'}`}>
            Nghe phát âm chuẩn
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            setActiveGame('sentence');
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
            activeGame === 'sentence'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20 font-bold'
              : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
          }`}
        >
          <span className="text-2xl">🧩</span>
          <span className="text-xs sm:text-sm font-black">3. Xếp Câu Order</span>
          <span className={`text-[10px] ${activeGame === 'sentence' ? 'text-amber-100' : 'text-stone-400'}`}>
            Lắp ghép câu vàng
          </span>
        </button>
      </div>

      {/* ----------------------------------------------------
       * GAME 1: MEMORY MATCHING CARDS
       * ---------------------------------------------------- */}
      {activeGame === 'memory' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          {/* Game Status Bar */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <span>🃏</span>
                <span>Trò Chơi Lật Thẻ Ghép Cặp (翻牌配对)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Lật một thẻ hình ảnh và một thẻ chữ Hán tương ứng để tạo thành cặp đúng!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold">
                Lượt lật: <span className="text-amber-700 text-sm font-black">{movesCount}</span>
              </div>
              <div className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
                Đã ghép: <span className="text-emerald-700 text-sm font-black">{matchCount}/6</span> cặp
              </div>
              <button
                onClick={initMemoryGame}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 transition-colors"
                title="Xáo bài chơi lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Victory Modal Overlay inside game */}
          {isMemoryWon ? (
            <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-300 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-amber-500 text-white flex items-center justify-center text-4xl mx-auto shadow-lg shadow-amber-500/30">
                🏆
              </div>
              <h3 className="text-2xl font-black text-stone-900">太棒了！Bạn Đã Thắng Trò Chơi!</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Bạn đã ghép đúng toàn bộ 6 cặp hình ảnh và chữ Hán sau <strong className="text-amber-800">{movesCount} lượt lật</strong>. Trí nhớ của bạn rất xuất sắc!
              </p>
              <button
                onClick={initMemoryGame}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Ván Mới (Đổi 6 Món Khác)</span>
              </button>
            </div>
          ) : (
            /* 12 Memory Cards Grid (4 cols on desktop, 3 on mobile) */
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              {memoryCards.map((card) => {
                const showContent = card.isFlipped || card.isMatched;

                return (
                  <div
                    key={card.uniqueId}
                    onClick={() => handleCardClick(card)}
                    className={`h-36 sm:h-44 rounded-2xl cursor-pointer transition-all duration-300 p-2 sm:p-3 flex flex-col items-center justify-center text-center select-none transform hover:scale-102 ${
                      card.isMatched
                        ? 'border-2 border-emerald-400 bg-emerald-50/80 shadow-xs opacity-90'
                        : showContent
                        ? 'border-2 border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-500/20'
                        : 'border-2 border-stone-200 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    {!showContent ? (
                      /* Card Back */
                      <div className="flex flex-col items-center justify-center text-white">
                        <span className="text-3xl mb-1">🧋</span>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-200">
                          CháYǔ
                        </span>
                        <span className="text-[9px] text-white/70">Bấm để lật</span>
                      </div>
                    ) : (
                      /* Card Front */
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        {card.type === 'image' ? (
                          <>
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-xs border border-stone-200 mb-1.5 shrink-0">
                              <img
                                src={card.drink.imageUrl}
                                alt={card.drink.nameVi}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-bold text-stone-800 line-clamp-1">
                              {card.drink.nameVi}
                            </span>
                            <span className="text-[10px] text-stone-400">Hình ảnh</span>
                          </>
                        ) : (
                          <>
                            <span className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                              {card.drink.nameZh}
                            </span>
                            {showPinyin && (
                              <span className="text-[11px] font-bold text-amber-800 mt-1">
                                {card.drink.pinyin}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-2">
                              Chữ Hán 汉字
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
       * GAME 2: LISTENING AUDIO QUIZ
       * ---------------------------------------------------- */}
      {activeGame === 'listening' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <span>🎧</span>
                <span>Nghe Phát Âm Tiếng Trung Đoán Món (听音辨词)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Bấm nút loa để nghe phát âm, sau đó chọn đúng thẻ đồ uống!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Chuỗi đúng: <strong className="text-orange-600 text-sm">{listenStreak}</strong></span>
              </div>
              <div className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
                Điểm: <strong className="text-emerald-700 text-sm">{listenScore}</strong>
              </div>
            </div>
          </div>

          {/* Big Speaker Button */}
          <div className="p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300 text-center flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => speakChinese(targetDrink.primaryZh, speechRate)}
              className="w-20 h-20 rounded-3xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 transition-transform active:scale-95"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <div className="text-xs font-bold text-amber-950">
              Bấm vào biểu tượng loa để nghe lại tên món nước (普通话)
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listenOptions.map((drink) => {
              const isSelected = selectedListenId === drink.id;
              let style = 'border-stone-200 bg-white hover:border-amber-300 text-stone-800';

              if (listenAnswered) {
                if (drink.id === targetDrink.id) {
                  style = 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20';
                } else if (isSelected && drink.id !== targetDrink.id) {
                  style = 'border-rose-500 bg-rose-50 ring-2 ring-rose-500/20';
                } else {
                  style = 'border-stone-200 bg-stone-100 opacity-60';
                }
              }

              return (
                <button
                  key={drink.id}
                  disabled={listenAnswered}
                  onClick={() => handlePickListenOption(drink)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs border border-stone-200 shrink-0">
                      <img src={drink.imageUrl} alt={drink.nameVi} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-stone-900">{drink.nameZh}</h4>
                      {showPinyin && (
                        <p className="text-xs font-bold text-amber-800">{drink.pinyin}</p>
                      )}
                      <p className="text-xs text-stone-600 mt-0.5">{drink.nameVi}</p>
                    </div>
                  </div>

                  {listenAnswered && drink.id === targetDrink.id && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Round Button */}
          {listenAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextListen}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Câu Tiếp Theo 👉</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
       * GAME 3: WORD SCRAMBLE SENTENCE BUILDER
       * ---------------------------------------------------- */}
      {activeGame === 'sentence' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <span>🧩</span>
                <span>Thử Tài Xếp Câu Order Chuẩn (点单拼句)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Bấm vào các khối từ bên dưới theo đúng thứ tự để tạo câu gọi món chuẩn ngữ pháp!
              </p>
            </div>

            <div className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              Câu số: {puzzleIdx + 1} / {sentencePuzzles.length}
            </div>
          </div>

          {/* Meaning Goal */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-xs font-bold text-amber-900 block mb-1">Mục tiêu câu cần xếp:</span>
            <p className="text-base sm:text-lg font-black text-stone-900">
              "{currentPuzzle.meaningVi}"
            </p>
          </div>

          {/* Target construction box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 min-h-[80px] flex flex-wrap items-center gap-2">
            {selectedWordIds.length === 0 ? (
              <span className="text-xs text-stone-400 italic">
                Bấm vào các thẻ từ vựng bên dưới theo thứ tự để ghép thành câu...
              </span>
            ) : (
              selectedWordIds.map((id) => {
                const w = currentPuzzle.words.find((item) => item.id === id);
                if (!w) return null;

                return (
                  <button
                    key={id}
                    disabled={scrambleAnswered}
                    onClick={() => handleTogglePuzzleWord(id)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs flex items-center gap-1.5"
                  >
                    <span>{w.zh}</span>
                    {showPinyin && <span className="text-[10px] text-amber-200">({w.py})</span>}
                  </button>
                );
              })
            )}
          </div>

          {/* Word Bank */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600 block">Kho thẻ từ vựng (bấm để chọn):</span>
            <div className="flex flex-wrap gap-2.5">
              {shuffledWordList.map((word) => {
                const isUsed = selectedWordIds.includes(word.id);

                return (
                  <button
                    key={word.id}
                    disabled={scrambleAnswered || isUsed}
                    onClick={() => handleTogglePuzzleWord(word.id)}
                    className={`px-4 py-2.5 rounded-2xl border text-sm font-black transition-all ${
                      isUsed
                        ? 'border-stone-200 bg-stone-100 text-stone-300'
                        : 'border-stone-300 bg-white hover:border-amber-400 text-stone-800 shadow-xs hover:bg-amber-50/50'
                    }`}
                  >
                    <div>{word.zh}</div>
                    <div className="text-[10px] font-normal text-stone-500">{word.vi}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result explanation */}
          {scrambleAnswered && (
            <div
              className={`p-4 rounded-2xl border ${
                scrambleCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
              } space-y-2 animate-in fade-in`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {scrambleCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Chính xác tuyệt đối! (太棒了!)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-rose-600" />
                    <span>Chưa đúng thứ tự, hãy cùng xem đáp án chuẩn nhé!</span>
                  </>
                )}
              </div>
              <p className="text-base font-black tracking-wide font-sans">{currentPuzzle.targetSentence}</p>
            </div>
          )}

          {/* Submit / Next Button */}
          <div className="flex items-center justify-between pt-2">
            {!scrambleAnswered ? (
              <button
                onClick={handleCheckSentence}
                disabled={selectedWordIds.length === 0}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
              >
                Kiểm Tra Câu Vừa Ghép
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playTap();
                  if (puzzleIdx + 1 < sentencePuzzles.length) {
                    setPuzzleIdx((p) => p + 1);
                  } else {
                    setPuzzleIdx(0);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{puzzleIdx + 1 < sentencePuzzles.length ? 'Câu Tiếp Theo 👉' : 'Chơi Lại Từ Đầu'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
