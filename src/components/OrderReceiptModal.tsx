import React, { useState } from 'react';
import { X, Volume2, Trash2, Printer, CheckCircle2, QrCode, CreditCard, Banknote, Sparkles, Plus, Copy, Check } from 'lucide-react';
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

export type PaymentMethodType = 'momo' | 'bank' | 'cash';

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('momo');
  const [isReadingFullBill, setIsReadingFullBill] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

    const totalInThousand = Math.round(totalAmount / 1000);
    const fullCashierSpeech = `您好，您一共点了${totalQuantity}杯饮品：${drinkSummaries}。一共${totalInThousand}千越盾。请问扫MoMo、银行转账还是现金支付？`;

    speakChinese(fullCashierSpeech, speechRate).then(() => {
      setIsReadingFullBill(false);
    });
  };

  const handleSelectPaymentMethod = (method: PaymentMethodType) => {
    sounds.playTap();
    setPaymentMethod(method);
    setPaymentDone(false);

    // Speak prompt based on method
    if (method === 'momo') {
      speakChinese('可以扫MoMo码，请扫屏幕上的二维码。', speechRate);
    } else if (method === 'bank') {
      speakChinese('支持银行转账，请扫VietQR二维码。', speechRate);
    } else {
      speakChinese('好的，现金支付，请在前台付款。', speechRate);
    }
  };

  const handleConfirmPaid = () => {
    sounds.playCashRegister();
    setPaymentDone(true);

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });

    let thanksSpeech = '收到您的现金付款，谢谢，请稍等叫号取餐！';
    if (paymentMethod === 'momo') {
      thanksSpeech = 'MoMo扫码成功，收到付款，谢谢，请稍等叫号取餐！';
    } else if (paymentMethod === 'bank') {
      thanksSpeech = '银行转账成功，收到付款，谢谢，请稍等叫号取餐！';
    }

    speakChinese(thanksSpeech, 0.9);
  };

  const handleCopy = (text: string, field: string) => {
    sounds.playTap();
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handlePrint = () => {
    sounds.playTap();
    window.print();
  };

  // Generate mock QR URL for MoMo and VietQR
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=2|99|0988888688|TRAN%20THI%20HUYEN|chayu@order.vn|0|0|${totalAmount}|CHAYU-A08|transfer_p2p`;
  const bankQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021238540010A0000007270124000697041501101088668899990208QRIBFTTA5303704540${totalAmount}5802VN62130809CHAYU-A086304`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="font-bold text-base leading-tight">Hóa Đơn Thực Hành (点单小票)</h3>
              <p className="text-xs text-stone-400">Xem bill, nghe phát âm và thực hành quét mã thanh toán</p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 space-y-5">
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
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 font-mono text-stone-800 text-xs sm:text-sm relative">
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

              {/* PAYMENT SECTION WITH REALISTIC QR CODES */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Phương Thức Thanh Toán (支付方式)</span>
                  </h4>
                  <span className="text-xs text-stone-400">Bấm chọn để hiện mã QR</span>
                </div>

                {/* 3 Payment Options: MoMo, Ngân hàng, Tiền mặt */}
                <div className="grid grid-cols-3 gap-2.5">
                  {/* 1. MoMo */}
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('momo')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'momo'
                        ? 'border-pink-500 bg-pink-50 text-pink-900 ring-2 ring-pink-500/20 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-pink-300 bg-white text-stone-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                      M
                    </div>
                    <div className="text-xs font-black">Quét MoMo</div>
                    <div className="text-[10px] text-pink-700 font-medium">MoMo扫码</div>
                  </button>

                  {/* 2. Ngân hàng / VietQR */}
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('bank')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'bank'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-blue-400 bg-white text-stone-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      QR
                    </div>
                    <div className="text-xs font-black">Ngân Hàng</div>
                    <div className="text-[10px] text-blue-700 font-medium">银行转账</div>
                  </button>

                  {/* 3. Tiền mặt */}
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'cash'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20 font-bold shadow-xs'
                        : 'border-stone-200 hover:border-amber-400 bg-white text-stone-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      💵
                    </div>
                    <div className="text-xs font-black">Tiền Mặt</div>
                    <div className="text-[10px] text-amber-700 font-medium">现金支付</div>
                  </button>
                </div>

                {/* QR CODE & PAYMENT DISPLAY AREA */}
                {paymentMethod === 'momo' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-pink-50/80 to-white border-2 border-pink-300 text-center space-y-3">
                    <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-pink-600 text-white font-bold text-xs flex items-center justify-center">
                          M
                        </span>
                        <span className="font-black text-sm text-pink-900">Mã QR Thanh Toán Ví MoMo</span>
                      </div>
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                        MoMo扫码
                      </span>
                    </div>

                    {/* QR Code Graphic */}
                    <div className="inline-block p-3 rounded-2xl bg-white border-2 border-pink-200 shadow-sm relative">
                      <img
                        src={momoQrUrl}
                        alt="Mã QR MoMo"
                        className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-pink-600 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                          MoMo
                        </div>
                      </div>
                    </div>

                    {/* Account details */}
                    <div className="bg-white p-3 rounded-xl border border-pink-100 text-xs space-y-1.5 text-left font-sans">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Người nhận:</span>
                        <span className="font-bold text-stone-900">TRẦN THỊ HUYỀN (CHÁYǓ TEA)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Số ví MoMo:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-pink-700">0988 888 688</span>
                          <button
                            onClick={() => handleCopy('0988888688', 'momo_phone')}
                            className="p-1 hover:bg-pink-50 rounded text-pink-600"
                            title="Sao chép"
                          >
                            {copiedField === 'momo_phone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                        <span className="text-stone-500">Số tiền:</span>
                        <span className="text-base font-black text-pink-600">{formatVND(totalAmount)}</span>
                      </div>
                    </div>

                    {/* Chinese Spoken Phrase Practice */}
                    <div className="p-2.5 rounded-xl bg-pink-100/60 border border-pink-200 text-xs text-left flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-pink-950">顾客：可以扫MoMo码吗？</div>
                        {showPinyin && <div className="text-[11px] text-pink-800">Kěyǐ sǎo MoMo mǎ ma?</div>}
                        <div className="text-[11px] text-stone-600 italic">"Cho hỏi có thể quét mã MoMo không?"</div>
                      </div>
                      <button
                        onClick={() => speakChinese('可以扫MoMo码吗？', speechRate)}
                        className="p-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white shrink-0 shadow-xs"
                        title="Nghe câu hỏi này"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Paid Button */}
                    <button
                      type="button"
                      onClick={handleConfirmPaid}
                      className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Đã Quét Mã MoMo Xong</span>
                    </button>
                  </div>
                )}

                {/* 2. BANK / VIETQR DISPLAY */}
                {paymentMethod === 'bank' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-blue-50/80 to-white border-2 border-blue-400 text-center space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                          QR
                        </span>
                        <span className="font-black text-sm text-blue-950">Mã VietQR - Chuyển Khoản Ngân Hàng</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        银行转账
                      </span>
                    </div>

                    {/* QR Code Graphic */}
                    <div className="inline-block p-3 rounded-2xl bg-white border-2 border-blue-300 shadow-sm relative">
                      <img
                        src={bankQrUrl}
                        alt="Mã VietQR"
                        className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg object-contain"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-blue-700 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                          VietQR
                        </div>
                      </div>
                    </div>

                    {/* Account details */}
                    <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs space-y-1.5 text-left font-sans">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Ngân hàng:</span>
                        <span className="font-bold text-blue-900">VietinBank (Công Thương)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Chủ tài khoản:</span>
                        <span className="font-bold text-stone-900">TIEM TRA SUA CHAYU</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Số tài khoản:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-blue-700">1088 6688 9999</span>
                          <button
                            onClick={() => handleCopy('108866889999', 'bank_acc')}
                            className="p-1 hover:bg-blue-50 rounded text-blue-600"
                            title="Sao chép"
                          >
                            {copiedField === 'bank_acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                        <span className="text-stone-500">Số tiền:</span>
                        <span className="text-base font-black text-blue-700">{formatVND(totalAmount)}</span>
                      </div>
                    </div>

                    {/* Chinese Spoken Phrase Practice */}
                    <div className="p-2.5 rounded-xl bg-blue-100/60 border border-blue-200 text-xs text-left flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-blue-950">顾客：支持银行转账吗？</div>
                        {showPinyin && <div className="text-[11px] text-blue-800">Zhīchí yínháng zhuǎnzhàng ma?</div>}
                        <div className="text-[11px] text-stone-600 italic">"Quán có nhận chuyển khoản ngân hàng không?"</div>
                      </div>
                      <button
                        onClick={() => speakChinese('支持银行转账吗？', speechRate)}
                        className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shrink-0 shadow-xs"
                        title="Nghe câu hỏi này"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Paid Button */}
                    <button
                      type="button"
                      onClick={handleConfirmPaid}
                      className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Đã Chuyển Khoản Xong</span>
                    </button>
                  </div>
                )}

                {/* 3. CASH DISPLAY */}
                {paymentMethod === 'cash' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto shadow-inner">
                      💵
                    </div>
                    <div>
                      <h5 className="font-black text-sm text-stone-900">Thanh Toán Tiền Mặt Tại Quầy (现金支付)</h5>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Khách đưa tiền mặt trực tiếp cho nhân viên thu ngân.
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-left font-sans space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Số tiền cần trả:</span>
                        <span className="text-base font-black text-amber-800">{formatVND(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Thu ngân thối lại:</span>
                        <span>Theo số tiền thực nhận</span>
                      </div>
                    </div>

                    {/* Chinese Spoken Phrase Practice */}
                    <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-left flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-amber-950">顾客：我付现金，给你钱。</div>
                        {showPinyin && <div className="text-[11px] text-amber-800">Wǒ fù xiànjīn, gěi nǐ qián.</div>}
                        <div className="text-[11px] text-stone-600 italic">"Tôi trả tiền mặt, gửi tiền bạn nhé."</div>
                      </div>
                      <button
                        onClick={() => speakChinese('我付现金，给你钱。', speechRate)}
                        className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shrink-0 shadow-xs"
                        title="Nghe câu này"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmPaid}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Đã Nhận Tiền Mặt</span>
                    </button>
                  </div>
                )}

                {/* Successful Payment Banner */}
                {paymentDone && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center gap-3 text-emerald-950 text-xs animate-in zoom-in-95">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-sm block">Thanh toán thành công! (支付成功)</span>
                      <p className="text-emerald-800 text-[11px] mt-0.5">
                        {paymentMethod === 'momo' && 'Đã nhận đủ tiền qua Ví MoMo. Cảm ơn bạn!'}
                        {paymentMethod === 'bank' && 'Đã nhận chuyển khoản ngân hàng thành công. Cảm ơn bạn!'}
                        {paymentMethod === 'cash' && 'Thu ngân đã nhận đủ tiền mặt. Xin cảm ơn quý khách!'}
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
