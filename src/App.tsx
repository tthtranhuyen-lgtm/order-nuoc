import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Coffee, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LessonHeader, PreferenceType } from './components/LessonHeader';
import { DrinkCard } from './components/DrinkCard';
import { CustomizationModal } from './components/CustomizationModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { DRINKS_DATA } from './data/drinks';
import { DrinkItem, DrinkCategory, OrderItem } from './types/menu';
import { buildOrderSentence, formatVND } from './utils/sentenceBuilder';
import { speakChinese } from './utils/speech';
import { sounds } from './utils/sound';

export default function App() {
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  // Lesson preference state
  const [preferenceType, setPreferenceType] = useState<PreferenceType>('like');
  const [selectedPreferenceDrink, setSelectedPreferenceDrink] = useState<DrinkItem | null>(DRINKS_DATA[0]);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart / Order
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Drink selected for order customization modal
  const [customizingDrink, setCustomizingDrink] = useState<DrinkItem | null>(null);

  // Cart totals
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Filtered Drinks
  const filteredDrinks = useMemo(() => {
    return DRINKS_DATA.filter((drink) => {
      const matchCategory = selectedCategory === 'all' || drink.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchSearch =
        drink.nameVi.toLowerCase().includes(q) ||
        drink.nameZh.toLowerCase().includes(q) ||
        drink.pinyin.toLowerCase().includes(q) ||
        drink.categoryNameVi.toLowerCase().includes(q) ||
        drink.descriptionVi.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Practice saying: "我喜欢喝 [Món này]"
  const handlePracticeLike = (drink: DrinkItem) => {
    setSelectedPreferenceDrink(drink);
    let speechText = `我喜欢喝${drink.primaryZh}。`;
    if (preferenceType === 'favorite') {
      speechText = `我最喜欢喝${drink.primaryZh}。`;
    } else if (preferenceType === 'want') {
      speechText = `我想喝一杯${drink.primaryZh}。`;
    } else if (preferenceType === 'dislike') {
      speechText = `我不喜欢喝${drink.primaryZh}。`;
    }
    speakChinese(speechText, speechRate);
  };

  // Click card: set as current practice drink and open customization if requested
  const handleSelectDrink = (drink: DrinkItem) => {
    setSelectedPreferenceDrink(drink);
    setCustomizingDrink(drink);
  };

  // Quick add default
  const handleQuickOrder = (drink: DrinkItem) => {
    const sentence = buildOrderSentence(drink, 'medium', '70', 'less', [], 'takeaway', 1);
    const orderItem: OrderItem = {
      orderId: 'quick_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      drink,
      size: 'medium',
      sugar: '70',
      ice: 'less',
      toppings: [],
      dining: 'takeaway',
      quantity: 1,
      unitPrice: drink.priceVnd,
      totalPrice: drink.priceVnd,
      chineseSentence: sentence.chinese,
      pinyinSentence: sentence.pinyin,
      vietnameseSentence: sentence.vietnamese,
    };
    setCartItems((prev) => [...prev, orderItem]);
  };

  const handleAddToCart = (item: OrderItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (orderId: string) => {
    setCartItems((prev) => prev.filter((item) => item.orderId !== orderId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-stone-50/80 text-stone-900 font-sans flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Streamlined Top Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => {
          sounds.playTap();
          setIsReceiptOpen(true);
        }}
        showPinyin={showPinyin}
        setShowPinyin={setShowPinyin}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
      />

      {/* Main Order & Speaking Practice Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* 1. DEDICATED LESSON HEADER: "Hôm nay học cách nói thích đồ uống gì" */}
        <LessonHeader
          currentDrink={selectedPreferenceDrink}
          preferenceType={preferenceType}
          setPreferenceType={setPreferenceType}
          showPinyin={showPinyin}
          speechRate={speechRate}
        />

        {/* 2. MENU FILTER & SEARCH ROW */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm món đồ uống: chanh, 柠檬, bơ, cam, đào, cà phê..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-100/80 border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              {[
                { key: 'all' as const, label: 'Tất cả (全部 10 món)', emoji: '🍹' },
                { key: 'tea' as const, label: 'Trà (茶饮)', emoji: '🍋' },
                { key: 'coffee' as const, label: 'Cà phê (咖啡)', emoji: '☕' },
                { key: 'juice' as const, label: 'Nước ép & Sinh tố (果汁)', emoji: '🥑' },
                { key: 'milktea' as const, label: 'Trà sữa & Cacao (特调)', emoji: '🍵' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedCategory(cat.key);
                  }}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.key
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
            <span>
              Menu đồ uống thực hành: <strong className="text-stone-800">{filteredDrinks.length}</strong> món
            </span>
            <span className="hidden sm:inline">
              Mẹo: Bấm nút hồng để nói "Tôi thích", bấm nút cam để chọn đường/đá tạo bill!
            </span>
          </div>
        </div>

        {/* 3. DRINK CARDS GRID (WITH REALISTIC PHOTOS CORRESPONDING TO EACH DRINK) */}
        {filteredDrinks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700">Không tìm thấy món nước nào</h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
            >
              Xem lại tất cả 10 món
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                showPinyin={showPinyin}
                speechRate={speechRate}
                isSelected={selectedPreferenceDrink?.id === drink.id}
                onSelect={(d) => handleSelectDrink(d)}
                onPracticeLike={(d) => handlePracticeLike(d)}
                onQuickOrder={(d) => handleQuickOrder(d)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Bar (Current Order Summary) */}
      {cartItems.length > 0 && !isReceiptOpen && (
        <div className="sticky bottom-4 z-30 max-w-md mx-auto px-4 w-full animate-in slide-in-from-bottom-3">
          <div
            onClick={() => {
              sounds.playTap();
              setIsReceiptOpen(true);
            }}
            className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between cursor-pointer hover:bg-stone-800 transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-white shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Đơn hàng của bạn ({cartCount} ly)</div>
                <div className="text-sm font-black text-white">{formatVND(cartTotal)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">Xem hóa đơn & Luyện đọc</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold flex items-center gap-1">
                <span>小票</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-5 text-stone-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">茶语 CháYǔ</span>
            <span>• Màn hình thực hành Order & Nói sở thích đồ uống (你喜欢喝什么？)</span>
          </div>
          <div className="text-stone-400">
            Học phát âm tiếng Trung & mặt chữ Hán qua hình ảnh trực quan
          </div>
        </div>
      </footer>

      {/* Customization Modal */}
      <CustomizationModal
        drink={customizingDrink}
        onClose={() => setCustomizingDrink(null)}
        onAddToCart={handleAddToCart}
        showPinyin={showPinyin}
        speechRate={speechRate}
      />

      {/* Order Receipt Modal */}
      <OrderReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onContinueOrdering={() => setIsReceiptOpen(false)}
        showPinyin={showPinyin}
        speechRate={speechRate}
      />
    </div>
  );
}
