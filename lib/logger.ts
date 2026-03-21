const isDev = process.env.NODE_ENV === "development";

export const logger = {
    info: (...args: unknown[]) => {
        if (isDev) console.log("[INFO]", ...args);
    },
    debug: (...args: unknown[]) => {
        if (isDev) console.debug("[DEBUG]", ...args);
    },
    warn: (...args: unknown[]) => {
        console.warn("[WARN]", ...args);
    },
    error: (...args: unknown[]) => {
        console.error("[ERROR]", ...args);
    },
};
