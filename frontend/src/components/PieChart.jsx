import React from 'react';
import '../styles/charts.css';

/**
 * Simple Pie Chart component using CSS for visualization
 * @param {Array} data - Array of objects with 'label', 'value', and optional 'color'
 * @param {string} title - Chart title (optional)
 */
const PieChart = ({ data = [], title = '' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="chart-container">
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                    No data available
                </p>
            </div>
        );
    }

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    // Default colors for pie chart segments
    const defaultColors = [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // amber
        '#ef4444', // red
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#14b8a6', // teal
        '#f97316', // orange
    ];

    // Calculate percentages and assign colors
    const chartData = data.map((item, index) => ({
        ...item,
        percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
        color: item.color || defaultColors[index % defaultColors.length],
    }));

    // Create gradient for conic-gradient
    let gradientStops = [];
    let currentPercentage = 0;

    chartData.forEach((item) => {
        const startPercentage = currentPercentage;
        const endPercentage = currentPercentage + parseFloat(item.percentage);
        gradientStops.push(
            `${item.color} ${startPercentage}% ${endPercentage}%`
        );
        currentPercentage = endPercentage;
    });

    const gradientString = gradientStops.join(', ');

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <div className="pie-chart-wrapper">
                <div
                    className="pie-chart"
                    style={{
                        background: `conic-gradient(${gradientString})`,
                    }}
                >
                    {/* Center circle for donut effect */}
                    <div className="pie-center">
                        <div className="pie-total">
                            <div className="pie-total-value">{total}</div>
                            <div className="pie-total-label">Total</div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="pie-legend">
                    {chartData.map((item, index) => (
                        <div key={index} className="pie-legend-item">
                            <div
                                className="pie-legend-color"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="pie-legend-content">
                                <span className="pie-legend-label">{item.label}</span>
                                <span className="pie-legend-value">
                                    {item.value} ({item.percentage}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PieChart;
