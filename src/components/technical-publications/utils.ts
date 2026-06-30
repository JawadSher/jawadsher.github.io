export function extractThumbnail(htmlText: string): string {
  if (!htmlText) return '';
  const match = htmlText.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

export function cleanDescription(htmlText: string): string {
  if (!htmlText) return '';
  let cleaned = htmlText.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, '');
  cleaned = cleaned.replace(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/gi, '');
  cleaned = cleaned.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*>/gi, '');
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (cleaned.length > 240) {
    cleaned = cleaned.slice(0, 240).trim() + '...';
  }
  return cleaned;
}

export function formatDate(dateStr: string): string {
  try {
    const cleanDateStr = dateStr.replace(/-/g, '/');
    const date = new Date(cleanDateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
