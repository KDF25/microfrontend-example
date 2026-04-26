import { Component, Suspense, type ReactNode } from "react";

interface State {
  error: Error | null;
}

interface Props {
  name: string;
  children: ReactNode;
}

// Remotes are loaded over the network. Any remote can fail to load (CDN
// outage, version skew, broken deploy) — when that happens the host must
// stay alive. This boundary shows a local fallback and logs the error.
class RemoteErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error(`[host] remote "${this.props.name}" failed to load:`, error);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="empty-state">
          <h2 style={{ marginTop: 0 }}>This section is unavailable</h2>
          <p>
            The <code>{this.props.name}</code> microfrontend failed to load.
            Try refreshing in a minute.
          </p>
          <pre
            style={{
              background: "var(--surface-alt)",
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              textAlign: "left",
              overflow: "auto",
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RemoteBoundary({ name, children }: Props) {
  return (
    <RemoteErrorBoundary name={name}>
      <Suspense fallback={<div className="empty-state">Loading {name}…</div>}>
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  );
}
