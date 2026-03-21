export const LIMITS = {
    message: { min: 1, max: 500 },
    author: { min: 1, max: 50 },
    authorPattern: /^[\w\s-]+$/,
} as const;

export function validateMessage(text: string): string | null {
    const trimmed = text.trim();
    if (trimmed.length < LIMITS.message.min) return "Message cannot be empty";
    if (trimmed.length > LIMITS.message.max)
        return `Message cannot exceed ${LIMITS.message.max} characters`;
    return null;
}

export function validateAuthor(name: string): string | null {
    const trimmed = name.trim();
    if (trimmed.length < LIMITS.author.min) return "Name cannot be empty";
    if (trimmed.length > LIMITS.author.max)
        return `Name cannot exceed ${LIMITS.author.max} characters`;
    if (!LIMITS.authorPattern.test(trimmed))
        return "Name can only contain letters, numbers, spaces, and hyphens";
    return null;
}
