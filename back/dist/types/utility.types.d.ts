/**
 * Utility Types
 * Define types for utility functions and helpers
 */
export interface SanitizeOptions {
    maxLength?: number;
    stripHtml?: boolean;
}
export interface ContentValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}
export interface IContentSanitizer {
    markdownToHtml(markdown: string): Promise<string>;
    sanitizeHtml(html: string): string;
    htmlToPlainText(html: string, maxLength?: number): string;
    validateContent(content: string): ContentValidationResult;
    generateExcerpt(html: string, maxLength?: number): string;
    stripHtml(html: string): string;
}
//# sourceMappingURL=utility.types.d.ts.map