/**
 * Formatting Utilities
 * Format data for display
 */

export const currencyFormatter = {
  format: (amount) => {
    if (!amount) return '0 đ';
    return `${(amount / 1000).toFixed(0)}.${((amount % 1000) / 100).toFixed(0)} đ`;
  },

  formatSimple: (amount) => {
    if (!amount) return '0';
    return (amount / 1000).toLocaleString('vi-VN');
  },

  parse: (text) => {
    const cleaned = text.replace(/[^\d]/g, '');
    return parseInt(cleaned) * 1000;
  },
};

export const dateFormatter = {
  format: (date, format = 'DD/MM/YYYY') => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
    if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
    return d.toLocaleDateString('vi-VN');
  },

  formatTime: (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  formatDateTime: (date) => {
    return `${dateFormatter.format(date)} ${dateFormatter.formatTime(date)}`;
  },

  formatRelative: (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return dateFormatter.format(date);
  },
};

export const phoneFormatter = {
  format: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return phone;
  },

  parse: (phone) => {
    return phone.replace(/\D/g, '');
  },
};

export const stringFormatter = {
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  titleCase: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  slug: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-');
  },

  truncate: (str, length = 50) => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  wordCount: (str) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
  },
};

export const numberFormatter = {
  abbreviate: (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },

  format: (num) => {
    return num.toLocaleString('vi-VN');
  },

  percentage: (num, decimals = 2) => {
    return (num * 100).toFixed(decimals) + '%';
  },
};

