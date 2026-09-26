import { useLayoutEffect, type ProfilerOnRenderCallback } from 'react';

export const profilingEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).has('profile');
export const renderMetrics = {
  components: {} as Record<string, number>,
  commits: 0,
  totalDurationMs: 0,
  maxDurationMs: 0,
};

if (profilingEnabled) Object.assign(window, { __JFF_RENDER_METRICS__: renderMetrics });

export function useRenderCounter(id: string) {
  useLayoutEffect(() => {
    if (profilingEnabled) renderMetrics.components[id] = (renderMetrics.components[id] ?? 0) + 1;
  });
}

export const recordRender: ProfilerOnRenderCallback = (_id, _phase, actualDuration) => {
  if (!profilingEnabled) return;
  renderMetrics.commits++;
  renderMetrics.totalDurationMs += actualDuration;
  renderMetrics.maxDurationMs = Math.max(renderMetrics.maxDurationMs, actualDuration);
};