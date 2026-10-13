import React, { useState } from 'react';
import { X, Volume2, Trash2, Printer, CheckCircle2, QrCode, CreditCard, Banknote, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderItem } from '../types/menu';
import { formatVND } from '../utils/sentenceBuilder';
import { speakChinese } from '../utils/speech';
import { sounds } from '../utils/sound';

interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onRemoveItem: (orderId: string) => void;
  onClearCart: () => void;
  onContinueOrdering: () => void;
  showPinyin: boolean;
  speechRate: number;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onContinueOrdering,
  showPinyin,
  speechRate,
}) => {
  if (!isOpen) return null;

  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'cash'>('wechat');
  const [isReadingFullBill, setIsReadingFullBill] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Generate full summary speech text for the cashier
  const handleReadFullBill = () => {
    if (items.length === 0) return;
    sounds.playTap();
    setIsReadingFullBill(true);

    const drinkSummaries = items.map((it) => {
      return `${it.quantity === 1 ? '一杯' : it.quantity + '杯'}${it.drink.primaryZh}`;
    }).join('，');

    const fullCashierSpeech = `您好，您一共点了${totalQuantity}杯饮品：${drinkSummaries}。请问微信还是现金支付？一共${Math.round(totalAmount / 1000)}千越盾。`;

    speakChinese(fullCashierSpeech, speechRate).then(() => {
      setIsReadingFullBill(false);
    });
  };

  const handlePay = (method: 'wechat' | 'alipay' | 'cash') => {
    setPaymentMethod(method);
    sounds.playCashRegister();
    setPaymentDone(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const thanksSpeech = method === 'cash' ? '收到您的现金，谢谢，请稍等取餐！' : '扫码成功，收到付款，谢谢，请稍等取餐！';
    speakChinese(thanksSpeech, 0.9);
  };

  const handlePrint = () => {
    sounds.playTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="font-bold text-base leading-tight">Hóa Đơn Thực Hành (点单小票)</h3>
              <p className="text-xs text-stone-400">Xem bill, nghe phát âm và luyện thanh toán</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl mb-3">
                🍵
              </div>
              <h4 className="text-lg font-bold text-stone-800">Chưa có món nào trong đơn!</h4>
              <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                Hãy quay lại Menu và bấm chọn món nước để luyện tập tùy chỉnh đường, đá và tạo câu gọi món nhé.
              </p>
              <button
                onClick={onContinueOrdering}
                className="mt-5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Xem Menu & Bấm Chọn Món</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Receipt Paper Container */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 font-mono text-stone-800 text-xs sm:text-sm relative">
                {/* Store Branding */}
                <div className="text-center border-b border-dashed border-stone-300 pb-4 mb-4">
                  <h2 className="text-xl font-black tracking-wider text-stone-900 font-sans">
                    茶语 CHÁ YǓ CAFE
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Quán Trà Sữa & Cà Phê Học Tiếng Trung
                  </p>
                  <div className="text-[11px] text-stone-400 mt-2 flex justify-between px-2 font-mono">
                    <span>Số bàn: #A-08</span>
                    <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3.5 border-b border-dashed border-stone-300 pb-4">
                  {items.map((item, idx) => (
                    <div key={item.orderId} className="group/item pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 font-sans text-sm sm:text-base">
                              {idx + 1}. {item.drink.nameZh}
                            </span>
                            <span className="text-xs text-stone-500 font-sans">
                              x{item.quantity}
                            </span>
                          </div>
                          {showPinyin && (
                            <p className="text-xs text-amber-800 font-sans font-medium">
                              {item.drink.pinyin}
                            </p>
                          )}
                          <p className="text-xs text-stone-600 font-sans">
                            {item.drink.nameVi}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-stone-900 font-sans">
                            {formatVND(item.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Customization Details */}
                      <div className="mt-1.5 p-2 bg-stone-50 rounded-lg text-xs font-sans text-stone-600 space-y-1">
                        <div className="text-stone-700">
                          <span className="font-semibold text-amber-800">Khách nói: </span>
                          <span>"{item.chineseSentence}"</span>
                        </div>
                        {showPinyin && (
                          <div className="text-[11px] text-stone-500">
                            {item.pinyinSentence}
                          </div>
                        )}
                        <div className="text-[11px] text-stone-500 italic">
                          "{item.vietnameseSentence}"
                        </div>
                      </div>

                      {/* Actions for this item */}
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            sounds.playTap();
                            speakChinese(item.chineseSentence, speechRate);
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Nghe món này</span>
                        </button>
                        <button
                          onClick={() => {
                            sounds.playTap();
                            onRemoveItem(item.orderId);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Xóa món này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Total */}
                <div className="pt-3 space-y-1 font-sans">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Tổng số lượng:</span>
                    <span>{totalQuantity} ly</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-stone-900 pt-1">
                    <span>TỔNG TIỀN (合计):</span>
                    <span className="text-amber-800 text-lg">{formatVND(totalAmount)}</span>
                  </div>
                </div>

                {/* Practice Speech Button on Receipt */}
                <div className="mt-4 pt-3 border-t border-dashed border-stone-300">
                  <button
                    onClick={handleReadFullBill}
                    disabled={isReadingFullBill}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isReadingFullBill
                        ? 'bg-amber-700 text-white animate-pulse'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>
                      {isReadingFullBill
                        ? 'Đang phát âm tóm tắt đơn hàng...'
                        : 'Nghe Thu Ngân đọc tóm tắt đơn bằng tiếng Trung'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Practice Section */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200">
                <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Thực Hành Chọn Phương Thức Thanh Toán (支付方式)</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handlePay('wechat')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentDone && paymentMethod === 'wechat'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-emerald-400 bg-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                    <div className="text-xs font-bold text-stone-800">微信支付</div>
                    <div className="text-[10px] text-stone-500">WeChat Pay</div>
                  </button>

                  <button
                    onClick={() => handlePay('alipay')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentDone && paymentMethod === 'alipay'
                        ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                        : 'border-stone-200 hover:border-sky-400 bg-white'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto text-sky-600 mb-1" />
                    <div className="text-xs font-bold text-stone-800">支付宝</div>
                    <div className="text-[10px] text-stone-500">Alipay</div>
                  </button>

                  <button
                    onClick={() => handlePay('cash')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentDone && paymentMethod === 'cash'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-amber-400 bg-white'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                    <div className="text-xs font-bold text-stone-800">现金支付</div>
                    <div className="text-[10px] text-stone-500">Tiền mặt</div>
                  </button>
                </div>

                {paymentDone && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Đã thanh toán thành công! (支付成功)</span>
                      <p className="text-emerald-700 text-[11px] mt-0.5">
                        Chúc mừng bạn đã hoàn thành bài thực hành order đồ uống!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          {items.length > 0 && (
            <button
              onClick={() => {
                sounds.playTap();
                onClearCart();
              }}
              className="px-3 py-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa đơn làm lại</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In hóa đơn</span>
            </button>
            <button
              onClick={onContinueOrdering}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Tiếp tục chọn món
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
