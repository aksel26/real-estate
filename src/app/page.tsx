'use client';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { GlobalStatusBar, MainLayout } from '@/components/layout';
import { KakaoMapLoader, MapContent } from '@/components/map';
import { ReportPanel } from '@/components/panel';
import PanelErrorFallback from '@/components/panel/PanelErrorFallback';
import ToastContainer from '@/components/layout/ToastContainer';
import { useToast } from '@/hooks/useToast';

function PanelFallback() {
  return (
    <PanelErrorFallback
      error={new Error('패널 오류')}
      resetErrorBoundary={() => window.location.reload()}
    />
  );
}

export default function Home() {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <GlobalStatusBar />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <MainLayout
        map={
          <KakaoMapLoader>
            <MapContent />
          </KakaoMapLoader>
        }
        panel={
          <ErrorBoundary fallback={<PanelFallback />}>
            <ReportPanel />
          </ErrorBoundary>
        }
      />
    </ErrorBoundary>
  );
}
