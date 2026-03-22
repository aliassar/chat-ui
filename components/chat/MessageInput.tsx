"use client";

import { useState } from "react";
import { validateMessage, LIMITS } from "@/lib/validation";
import { logger } from "@/lib/logger";

export default function MessageInput({ onSend }: { onSend: (text: string) => Promise<void> }) {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const err = validateMessage(text);
        if (err) {
            setError(err);
            return;
        }

        setSending(true);
        setError("");

        try {
            await onSend(text.trim());
            setText("");
        } catch (e) {
            logger.error("send failed", e);
            setError("Failed to send. Try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500 text-xs px-4 py-1">{error}</p>}
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-[8px] p-[8px]"
                style={{ backgroundColor: "var(--color-input-bar)" }}
            >
                <input
                    type="text"
                    value={text}
                    onChange={e => { setText(e.target.value); if (error) setError(""); }}
                    placeholder="Message"
                    maxLength={LIMITS.message.max}
                    autoFocus
                    disabled={sending}
                    className="flex-1 rounded p-[8px] text-sm bg-white border-none focus:outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="rounded px-5 py-2 text-white text-sm font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                    style={{ backgroundColor: "var(--color-send-btn)" }}
                >
                    {sending ? "..." : "Send"}
                </button>
            </form>
        </div>
    );
}
