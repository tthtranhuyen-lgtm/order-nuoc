import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  PenTool,
  Highlighter,
  Eraser,
  Undo2,
  Trash2,
  Eye,
  EyeOff,
  MousePointer2,
  X,
  GripHorizontal,
} from 'lucide-react';
import { sounds } from '../utils/sound';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  size: number;
  mode: 'pen' | 'highlighter';
}

interface TeacherPenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const PEN_COLORS = [
  { name: 'Đỏ', hex: '#ef4444' },
  { name: 'Xanh dương', hex: '#2563eb' },
  { name: 'Xanh lá', hex: '#16a34a' },
  { name: 'Vàng cam', hex: '#f59e0b' },
  { name: 'Đen', hex: '#1c1917' },
];

const PEN_SIZES = [
  { label: 'Mảnh', value: 3 },
  { label: 'Vừa', value: 6 },
  { label: 'Đậm', value: 11 },
];

export const TeacherPenOverlay: React.FC<TeacherPenOverlayProps> = ({
  isOpen,
  onClose,
  pageKey,
  containerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store strokes per page/tab so switching tabs preserves annotations separately
  const [strokesByTab, setStrokesByTab] = useState<Record<string, Stroke[]>>({});
  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser' | 'browse'>('pen');
  const [color, setColor] = useState<string>('#ef4444');
  const [strokeSize, setStrokeSize] = useState<number>(6);
  const [showInk, setShowInk] = useState<boolean>(true);

  // Active drawing refs for 60fps pointer tracking without re-render lag
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const strokesRef = useRef<Stroke[]>([]);

  const currentTabStrokes = strokesByTab[pageKey] || [];
  strokesRef.current = currentTabStrokes;

  // Draw a single smooth stroke onto canvas context
  const drawStrokeOnCtx = useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;

    if (stroke.mode === 'highlighter') {
      ctx.globalAlpha = 0.32;
      ctx.lineWidth = stroke.size * 3.2;
    } else {
      ctx.globalAlpha = 1;
      ctx.lineWidth = stroke.size;
    }

    ctx.beginPath();
    const pts = stroke.points;
    if (pts.length === 1) {
      ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.color;
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.restore();
  }, []);

  // Render all committed strokes + live stroke
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!showInk) return;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const s of strokesRef.current) {
      drawStrokeOnCtx(ctx, s);
    }
    if (currentStrokeRef.current) {
      drawStrokeOnCtx(ctx, currentStrokeRef.current);
    }

    ctx.restore();
  }, [drawStrokeOnCtx, showInk]);

  // Sync canvas size with container dimensions
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.min(Math.floor(container.scrollHeight), 8000));

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      redrawCanvas();
    };

    updateSize();
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateSize);
    });
    observer.observe(container);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [containerRef, redrawCanvas, pageKey]);

  // Redraw whenever strokes or visibility changes
  useEffect(() => {
    redrawCanvas();
  }, [currentTabStrokes, showInk, pageKey, redrawCanvas]);

  const getLocalPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Erase any stroke whose points come within radius of pointer
  const eraseAtPoint = (pt: Point) => {
    const radius = 18;
    const targetStrokes = strokesRef.current;
    const remaining = targetStrokes.filter((stroke) => {
      const hitThreshold = radius + (stroke.mode === 'highlighter' ? stroke.size * 1.5 : stroke.size / 2);
      return !stroke.points.some(
        (p) => Math.hypot(p.x - pt.x, p.y - pt.y) <= hitThreshold
      );
    });

    if (remaining.length !== targetStrokes.length) {
      setStrokesByTab((prev) => ({
        ...prev,
        [pageKey]: remaining,
      }));
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isOpen || activeTool === 'browse') return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const pt = getLocalPoint(e);

    if (activeTool === 'eraser') {
      isDrawingRef.current = true;
      eraseAtPoint(pt);
      return;
    }

    isDrawingRef.current = true;
    setShowInk(true);
    currentStrokeRef.current = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      points: [pt],
      color,
      size: strokeSize,
      mode: activeTool,
    };
    redrawCanvas();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !isOpen || activeTool === 'browse') return;

    const pt = getLocalPoint(e);

    if (activeTool === 'eraser') {
      eraseAtPoint(pt);
      return;
    }

    if (currentStrokeRef.current) {
      const pts = currentStrokeRef.current.points;
      const last = pts[pts.length - 1];
      // Slight distance filter for smooth curves
      if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 2) {
        pts.push(pt);
        redrawCanvas();
      }
    }
  };

  const finishStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (activeTool !== 'eraser' && currentStrokeRef.current) {
      const finished = currentStrokeRef.current;
      currentStrokeRef.current = null;
      setStrokesByTab((prev) => ({
        ...prev,
        [pageKey]: [...(prev[pageKey] || []), finished],
      }));
    }
  };

  const handleUndo = () => {
    sounds.playTap();
    setStrokesByTab((prev) => {
      const list = prev[pageKey] || [];
      if (list.length === 0) return prev;
      return {
        ...prev,
        [pageKey]: list.slice(0, -1),
      };
    });
  };

  const handleClear = () => {
    sounds.playTap();
    setStrokesByTab((prev) => ({
      ...prev,
      [pageKey]: [],
    }));
  };

  const isCanvasInteractive = isOpen && activeTool !== 'browse';

  return (
    <>
      {/* Full-document transparent annotation canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
        className={`absolute top-0 left-0 z-35 transition-opacity ${
          isCanvasInteractive
            ? `pointer-events-auto touch-none ${
                activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
              }`
            : 'pointer-events-none'
        }`}
        style={{
          opacity: showInk ? 1 : 0,
        }}
      />

      {/* Floating Teacher Pen Toolbar */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex justify-end pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-2 border-amber-300 shadow-2xl rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2.5 max-w-full sm:w-auto animate-in slide-in-from-bottom-4 duration-200">
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5">
                <GripHorizontal className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black text-stone-900">
                  Bút Giảng Bài (教鞭笔)
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTool === 'browse'
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-rose-100 text-rose-700 animate-pulse'
                  }`}
                >
                  {activeTool === 'browse' ? 'Đang bấm trang' : 'Đang vẽ trên màn hình'}
                </span>
              </div>

              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                title="Đóng thanh bút viết"
                className="p-1 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tool Mode Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Pen */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setActiveTool('pen');
                  setShowInk(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeTool === 'pen'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Bút viết</span>
              </button>

              {/* Highlighter */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setActiveTool('highlighter');
                  setShowInk(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeTool === 'highlighter'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>Dạ quang</span>
              </button>

              {/* Eraser */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setActiveTool('eraser');
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeTool === 'eraser'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Tẩy nét</span>
              </button>

              {/* Browse / Click mode */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setActiveTool('browse');
                }}
                title="Tạm dừng vẽ để bấm nút nghe loa hoặc cuộn/chọn đáp án"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeTool === 'browse'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                <span>Bấm trang</span>
              </button>
            </div>

            {/* Colors, Sizes & Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
              {/* Colors */}
              <div className="flex items-center gap-1.5">
                {PEN_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      sounds.playTap();
                      setColor(c.hex);
                      if (activeTool === 'eraser' || activeTool === 'browse') {
                        setActiveTool('pen');
                      }
                    }}
                    title={`Màu ${c.name}`}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      color === c.hex && activeTool !== 'eraser' && activeTool !== 'browse'
                        ? 'scale-115 border-stone-900 ring-2 ring-amber-400'
                        : 'border-white shadow-xs hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>

              {/* Thickness */}
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                {PEN_SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      sounds.playTap();
                      setStrokeSize(s.value);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      strokeSize === s.value
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Undo, Hide/Show Ink, Clear */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={currentTabStrokes.length === 0}
                  title="Hoàn tác nét vừa vẽ"
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 transition-colors"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setShowInk(!showInk);
                  }}
                  title={showInk ? 'Ẩn tạm nét vẽ' : 'Hiện lại nét vẽ'}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    showInk
                      ? 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                      : 'bg-amber-100 border-amber-300 text-amber-800'
                  }`}
                >
                  {showInk ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleClear}
                  disabled={currentTabStrokes.length === 0}
                  title="Xóa toàn bộ nét vẽ trên trang này"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-700 text-[11px] font-bold border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
