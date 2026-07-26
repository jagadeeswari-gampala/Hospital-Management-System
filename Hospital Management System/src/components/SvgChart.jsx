import React, { useState } from 'react';

const SvgChart = ({ title, type = 'line', data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  // Chart Dimensions
  const width = 500;
  const height = 200;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate scales
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 10);
  const minValue = 0;
  const valueRange = maxValue - minValue;

  const getX = (index) => {
    return padding + (index * (chartWidth / (data.length - 1 || 1)));
  };

  const getY = (value) => {
    const ratio = (value - minValue) / valueRange;
    return height - padding - (ratio * chartHeight);
  };

  // Generate line path
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
  // Area under path
  const areaPath = data.length > 0 
    ? `${linePath} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z` 
    : '';

  return (
    <div className="card" style={styles.container}>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * chartHeight;
            const gridVal = Math.round(maxValue - (ratio * valueRange));
            return (
              <g key={i}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="var(--border-color)" 
                  strokeWidth="0.8" 
                  strokeDasharray="4,4" 
                />
                <text 
                  x={padding - 8} 
                  y={y + 4} 
                  fill="var(--text-tertiary)" 
                  fontSize="9" 
                  textAnchor="end"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Render Line Chart */}
          {type === 'line' && (
            <>
              {/* Shaded Area */}
              <path d={areaPath} fill="url(#chartGradient)" />
              
              {/* Main Line */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data points/Circles */}
              {data.map((d, i) => (
                <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                  <circle 
                    cx={getX(i)} 
                    cy={getY(d.value)} 
                    r={hoveredIndex === i ? 6 : 4} 
                    fill="var(--bg-secondary)" 
                    stroke={hoveredIndex === i ? "var(--secondary)" : "var(--primary)"} 
                    strokeWidth="2.5" 
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }} 
                  />
                  {hoveredIndex === i && (
                    <g>
                      <rect 
                        x={getX(i) - 25} 
                        y={getY(d.value) - 30} 
                        width="50" 
                        height="20" 
                        rx="4" 
                        fill="var(--bg-tertiary)" 
                        stroke="var(--border-color)" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={getX(i)} 
                        y={getY(d.value) - 17} 
                        fill="var(--text-primary)" 
                        fontSize="9" 
                        fontWeight="700" 
                        textAnchor="middle"
                      >
                        {d.value}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </>
          )}

          {/* Render Bar Chart */}
          {type === 'bar' && (
            <g>
              {data.map((d, i) => {
                const barWidth = Math.min((chartWidth / data.length) * 0.6, 30);
                const gap = (chartWidth / data.length);
                const x = padding + (i * gap) + (gap - barWidth) / 2;
                const y = getY(d.value);
                const h = Math.max(height - padding - y, 2); // At least 2px height
                const isHovered = hoveredIndex === i;

                return (
                  <g 
                    key={i} 
                    onMouseEnter={() => setHoveredIndex(i)} 
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect 
                      x={x} 
                      y={y} 
                      width={barWidth} 
                      height={h} 
                      rx="4" 
                      fill="url(#barGradient)" 
                      opacity={hoveredIndex === null || isHovered ? 1 : 0.6}
                      style={{ transition: 'all 0.2s ease' }} 
                    />
                    
                    {isHovered && (
                      <g>
                        <rect 
                          x={x + barWidth / 2 - 25} 
                          y={y - 30} 
                          width="50" 
                          height="20" 
                          rx="4" 
                          fill="var(--bg-tertiary)" 
                          stroke="var(--border-color)" 
                          strokeWidth="1" 
                        />
                        <text 
                          x={x + barWidth / 2} 
                          y={y - 17} 
                          fill="var(--text-primary)" 
                          fontSize="9" 
                          fontWeight="700" 
                          textAnchor="middle"
                        >
                          {d.value}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = type === 'line' 
              ? getX(i) 
              : padding + (i * (chartWidth / data.length)) + (chartWidth / data.length) / 2;
            return (
              <text 
                key={i} 
                x={x} 
                y={height - padding + 15} 
                fill="var(--text-tertiary)" 
                fontSize="9" 
                fontWeight="500" 
                textAnchor="middle"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    height: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  chartWrapper: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 'calc(100% - 30px)',
  }
};

export default SvgChart;
