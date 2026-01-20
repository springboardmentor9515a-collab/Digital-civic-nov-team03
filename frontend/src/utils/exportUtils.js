/**
 * Convert array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header names (optional, will use object keys if not provided)
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data, headers = null) => {
    if (!data || data.length === 0) {
        return '';
    }

    // Use provided headers or extract from first object
    const csvHeaders = headers || Object.keys(data[0]);

    // Create header row
    const headerRow = csvHeaders.join(',');

    // Create data rows
    const dataRows = data.map(row => {
        return csvHeaders.map(header => {
            const value = row[header];
            // Handle values that contain commas, quotes, or newlines
            if (value === null || value === undefined) {
                return '';
            }
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};

/**
 * Download data as CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file to download
 * @param {Array} headers - Optional custom headers
 */
export const downloadCSV = (data, filename = 'export.csv', headers = null) => {
    const csv = convertToCSV(data, headers);

    // Create blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
};

/**
 * Format reports data for CSV export
 * @param {Object} reportData - Report data object from API
 * @param {Object} filters - Applied filters (date range, location)
 * @returns {Array} Array of formatted data objects
 */
export const formatReportsForExport = (reportData, filters = {}) => {
    const exportData = [];

    // Add metadata row
    exportData.push({
        'Report Type': 'Civix Platform Analytics Report',
        'Generated On': new Date().toLocaleString(),
        'Date Range': filters.dateRange || 'All Time',
        'Location': filters.location || 'All Locations',
    });

    exportData.push({}); // Empty row for spacing

    // Petition statistics
    exportData.push({ 'Section': 'Petition Statistics' });
    if (reportData.petitionsByStatus) {
        reportData.petitionsByStatus.forEach(item => {
            exportData.push({
                'Status': item._id || 'Unknown',
                'Count': item.count,
            });
        });
    }

    exportData.push({}); // Empty row

    // Poll statistics
    exportData.push({ 'Section': 'Poll Statistics' });
    if (reportData.pollVotes) {
        exportData.push({
            'Total Polls': reportData.pollVotes.length,
            'Total Votes': reportData.pollVotes.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
        });
    }

    exportData.push({}); // Empty row

    // Signature statistics
    exportData.push({ 'Section': 'Signature Statistics' });
    if (reportData.signatureTotals) {
        exportData.push({
            'Total Signatures': reportData.signatureTotals.reduce((sum, s) => sum + (s.total || 0), 0),
            'Petitions with Signatures': reportData.signatureTotals.length,
        });
    }

    return exportData;
};

/**
 * Format date for filename
 * @param {Date} date - Date object
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDateForFilename = (date = new Date()) => {
    return date.toISOString().split('T')[0];
};

/**
 * Generate filename for report export
 * @param {string} reportType - Type of report
 * @param {Object} filters - Applied filters
 * @returns {string} Generated filename
 */
export const generateReportFilename = (reportType = 'report', filters = {}) => {
    const dateStr = formatDateForFilename();
    const location = filters.location ? `_${filters.location.replace(/\s+/g, '-')}` : '';
    return `civix_${reportType}${location}_${dateStr}.csv`;
};
