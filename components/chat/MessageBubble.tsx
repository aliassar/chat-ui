import { memo } from "react";
import type { Message } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtTime(iso: string) {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
    return (
        <li className={`message-enter flex ${isOwn ? "justify-end" : "justify-start"}`} style={{ paddingLeft: 24, paddingRight: 24 }}>
            <div
                className="rounded-sm border pb-[8px] mb-[16px] max-w-[240px] sm:max-w-[420px]"
                style={{
                    backgroundColor: isOwn ? "var(--color-own-bg)" : "#fff",
                    borderColor: isOwn ? "#f0e68c" : "var(--color-border)",
                }}
            >
                <div className="flex flex-col p-[16px]">
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--color-primary)" }}>
                        {message.author}
                    </p>
                    <p className="text-sm font-semibold leading-snug break-words" style={{ color: "var(--color-text-dark)" }}>
                        {message.message}
                    </p>
                </div>
                <p className="text-[11px] mt-1 pr-2 pl-2" style={{ color: "var(--color-primary)" }}>
                    {fmtTime(message.createdAt)}
                </p>
            </div>
        </li>
    );
}

// memo matters here since the list can get long
export default memo(MessageBubble);
