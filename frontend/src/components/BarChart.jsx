import React from 'react';
import '../styles/charts.css';

/**
 * Simple Bar Chart component for displaying poll results
 * @param {Array} data - Array of objects with 'label', 'value', and optional 'color'
 * @param {string} title - Chart title (optional)
 */
const BarChart = ({ data = [], title = '', maxValue = null }) => {
    if (!data || data.length === 0) {
        return (
            <div className="chart-container">
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                    No data available
                </p>
            </div>
        );
    }

    const max = maxValue || Math.max(...data.map(item => item.value || 0));

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <div className="bar-chart">
                {data.map((item, index) => {
                    const percentage = max > 0 ? (item.value / max) * 100 : 0;
                    const color = item.color || '#3b82f6';

                    return (
                        <div key={index} className="bar-item">
                            <div className="bar-label-container">
                                <span className="bar-label">{item.label}</span>
                                <span className="bar-value">
                                    {item.value} {item.percentage ? `(${item.percentage}%)` : ''}
                                </span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: color,
                                    }}
                                >
                                    {percentage > 10 && (
                                        <span className="bar-fill-text">
                                            {item.percentage || Math.round(percentage) + '%'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BarChart;
