"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSanitizer = void 0;
const marked_1 = require("marked");
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
/**
 * Sanitizes and converts Markdown to HTML
 * This function ensures that user-generated content is safe from XSS attacks
 */
class ContentSanitizer {
    static allowedTags = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'b', 'i', 'u', 's', 'mark',
        'blockquote', 'pre', 'code',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
    ];
    static allowedAttributes = {
        'a': ['href', 'title', 'target', 'rel'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'code': ['class'],
        'pre': ['class'],
        'div': ['class'],
        'span': ['class'],
    };
    static allowedProtocols = ['http', 'https', 'mailto'];
    /**
     * Convert Markdown to sanitized HTML
     */
    static async markdownToHtml(markdown) {
        // Configure marked for security
        marked_1.marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert \n to <br>
        });
        // Convert markdown to HTML
        const rawHtml = await marked_1.marked.parse(markdown);
        // Sanitize the HTML - this will escape dangerous content
        return this.sanitizeHtml(rawHtml);
    }
    /**
     * Sanitize HTML content
     */
    static sanitizeHtml(html) {
        return isomorphic_dompurify_1.default.sanitize(html, {
            ALLOWED_TAGS: this.allowedTags,
            ALLOWED_ATTR: Object.values(this.allowedAttributes).flat(),
            ALLOW_DATA_ATTR: false,
            ALLOWED_URI_REGEXP: new RegExp(`^(?:(?:${this.allowedProtocols.join('|')}):)`, 'i'),
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
    static htmlToPlainText(html, maxLength) {
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
    static validateContent(content) {
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
    static async generateExcerpt(markdown, maxLength = 200) {
        const html = await this.markdownToHtml(markdown);
        return this.htmlToPlainText(html, maxLength);
    }
    /**
     * Strip all HTML tags from content
     */
    static stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').trim();
    }
}
exports.ContentSanitizer = ContentSanitizer;
//# sourceMappingURL=contentSanitizer.js.map