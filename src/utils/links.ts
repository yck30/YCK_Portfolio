export interface CustomLink {
  url: string;
  label?: string;
}

/**
 * Parses single URL strings, JSON strings, or arrays into structured CustomLink[]
 */
export function parseCustomLinks(linkData: any, fallbackLabel?: string): CustomLink[] {
  if (!linkData) return [];

  // If already an array
  if (Array.isArray(linkData)) {
    return linkData
      .filter((item: any) => item && (typeof item === 'string' || item.url))
      .map((item: any) => {
        if (typeof item === 'string') {
          return { url: item.trim(), label: fallbackLabel || '' };
        }
        return {
          url: (item.url || '').trim(),
          label: (item.label || item.description || item.cta || fallbackLabel || '').trim()
        };
      })
      .filter((item: CustomLink) => item.url !== '' && item.url !== '#');
  }

  // If JSON or simple string
  if (typeof linkData === 'string') {
    const trimmed = linkData.trim();
    if (!trimmed || trimmed === '#') return [];

    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseCustomLinks(parsed, fallbackLabel);
      } catch (e) {
        // Fall through to plain URL string
      }
    }

    return [{ url: trimmed, label: fallbackLabel || '' }];
  }

  // If object with url
  if (typeof linkData === 'object' && linkData.url) {
    return [{
      url: String(linkData.url).trim(),
      label: String(linkData.label || linkData.description || linkData.cta || fallbackLabel || '').trim()
    }].filter((item: CustomLink) => item.url !== '');
  }

  return [];
}

/**
 * Serializes CustomLink[] into database storage format
 */
export function serializeCustomLinks(links: CustomLink[]): string | null {
  const valid = (links || []).filter(l => l && l.url && l.url.trim() !== '' && l.url.trim() !== '#');
  if (valid.length === 0) return null;
  if (valid.length === 1 && (!valid[0].label || valid[0].label.trim() === '')) {
    return valid[0].url.trim();
  }
  return JSON.stringify(valid.map(l => ({
    url: l.url.trim(),
    label: (l.label || '').trim()
  })));
}

/**
 * Formats a clean display domain/hostname from a URL
 */
export function formatDisplayUrl(url: string): string {
  try {
    const withoutProtocol = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    return withoutProtocol;
  } catch (e) {
    return url;
  }
}
