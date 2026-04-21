"use client";

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
});

type MermaidDiagramProps = {
  chart: string;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    async function renderChart() {
      if (chartRef.current) {
        try {
          const { svg } = await mermaid.render('mermaid-chart', chart);
          setSvg(svg);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          setSvg('<p style="color: red;">Error rendering diagram. Check console for details.</p>');
        }
      }
    }
    renderChart();
  }, [chart]);

  return (
    <div ref={chartRef} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
