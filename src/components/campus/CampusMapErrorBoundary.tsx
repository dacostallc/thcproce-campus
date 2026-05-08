"use client";

import React from "react";
import { CampusMapCanvasFallback } from "./CampusMapCanvasFallback";

type Props = React.PropsWithChildren<{
  bgNightSrc: string;
  bgDaySrc: string;
}>;

type State = {
  error: Error | null;
};

/**
 * Evita tela só com HUD quando Framer Motion, Next/Image ou filhos do canvas rebentam no cliente.
 */
export class CampusMapErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.warn("[CampusMap] ErrorBoundary capturou erro no canvas:", error.message, info.componentStack);
  }

  private retry = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    const { children, bgNightSrc, bgDaySrc } = this.props;

    if (this.state.error) {
      return (
        <CampusMapCanvasFallback
          bgNightSrc={bgNightSrc}
          bgDaySrc={bgDaySrc}
          hint="As animações do mapa falharam; o fundo estático continua visível. Recarregar a página ou usar o botão abaixo pode restaurar o modo completo."
          onRetry={this.retry}
        />
      );
    }

    return children;
  }
}
