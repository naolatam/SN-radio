import { ContentValidationResult } from '../types/utility.types';
/**
 * Sanitizes and converts Markdown to HTML
 * This function ensures that user-generated content is safe from XSS attacks
 */
export declare class ContentSanitizer {
    private static allowedTags;
    private static allowedAttributes;
    private static allowedProtocols;
    /**
     * Convert Markdown to sanitized HTML
     */
    static markdownToHtml(markdown: string): Promise<string>;
    /**
     * Sanitize HTML content
     */
    static sanitizeHtml(html: string): string;
    /**
     * Extract plain text from HTML (for excerpts)
     */
    static htmlToPlainText(html: string, maxLength?: number): string;
    /**
     * Validate if content is safe (additional validation before storing)
     */
    static validateContent(content: string): ContentValidationResult;
    /**
     * Generate a safe excerpt from markdown content
     */
    static generateExcerpt(markdown: string, maxLength?: number): Promise<string>;
    /**
     * Strip all HTML tags from content
     */
    static stripHtml(html: string): string;
}
//# sourceMappingURL=contentSanitizer.d.ts.map