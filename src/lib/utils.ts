/**
 * Formats a number to Indian currency format (e.g. ₹85,00,000 or ₹1.35 Cr)
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (!amount || isNaN(amount)) return 'Price on Request';
  
  if (compact) {
    if (amount >= 10000000) {
      const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹${cr} Cr`;
    }
    if (amount >= 100000) {
      const lk = (amount / 100000).toFixed(2).replace(/\.00$/, '');
      return `₹${lk} L`;
    }
    if (amount >= 1000) {
      const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
      return `₹${k} K`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(sqFt: number): string {
  if (!sqFt) return '';
  return `${sqFt.toLocaleString('en-IN')} sq ft`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
