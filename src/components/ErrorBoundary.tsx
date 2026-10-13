import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto">
              🍵
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              Menu Đang Khởi Động Lại
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Đã xảy ra sự cố hiển thị nhỏ trong trình duyệt. Vui lòng bấm nút bên dưới để tải lại trang menu.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md transition-all"
            >
              Tải lại trang (刷新页面)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
