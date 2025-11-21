import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { ContentValidationResult } from '../types/utility.types';

/**
 * Sanitizes and converts Markdown to HTML
 * This function ensures that user-generated content is safe from XSS attacks
 */
export class ContentSanitizer {
  private static allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'strong', 'em', 'b', 'i', 'u', 's', 'mark',
    'blockquote', 'pre', 'code',
    'ul', 'ol', 'li',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
  ];

  private static allowedAttributes = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'code': ['class'],
    'pre': ['class'],
    'div': ['class'],
    'span': ['class'],
  };

  private static allowedProtocols = ['http', 'https', 'mailto'];

  /**
   * Convert Markdown to sanitized HTML
   */
  static async markdownToHtml(markdown: string): Promise<string> {
    // Configure marked for security
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
    });

    // Convert markdown to HTML
    const rawHtml = await marked.parse(markdown);

    // Sanitize the HTML - this will escape dangerous content
    return this.sanitizeHtml(rawHtml);
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: this.allowedTags,
      ALLOWED_ATTR: Object.values(this.allowedAttributes).flat(),
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: new RegExp(
        `^(?:(?:${this.allowedProtocols.join('|')}):)`,
        'i'
      ),
      KEEP_CONTENT: true,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
      FORCE_BODY: false,
      SAFE_FOR_TEMPLATES: true, // Escape template literals
    });
  }

  /**
   * Extract plain text from HTML (for excerpts)
   */
  static htmlToPlainText(html: string, maxLength?: number): string {
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Truncate if needed
    if (maxLength && text.length > maxLength) {
      text = text.substring(0, maxLength).trim() + '...';
    }
    
    return text;
  }

  /**
   * Validate if content is safe (additional validation before storing)
   */
  static validateContent(content: string): ContentValidationResult {
    if (!content || content.trim().length === 0) {
      return { isValid: false, errors: ['Content cannot be empty'] };
    }

    if (content.length > 100000) {
      return { isValid: false, errors: ['Content is too long (max 100KB)'] };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // onclick, onerror, etc.
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        return { isValid: false, errors: ['Content contains potentially dangerous code'] };
      }
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Generate a safe excerpt from markdown content
   */
  static async generateExcerpt(markdown: string, maxLength: number = 200): Promise<string> {
    const html = await this.markdownToHtml(markdown);
    return this.htmlToPlainText(html, maxLength);
  }

  /**
   * Strip all HTML tags from content
   */
  static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
