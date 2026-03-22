"use client";

import { useRef } from "react";
import type { Message } from "@/lib/types";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import MessageBubble from "./MessageBubble";
import DateDivider from "./DateDivider";

function isDifferentDay(a: string, b: string) {
    return a.slice(0, 10) !== b.slice(0, 10);
}

export default function MessageList({ messages, currentUser }: { messages: Message[]; currentUser: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    useAutoScroll(scrollRef, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm">No messages yet. Say something!</p>
            </div>
        );
    }

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
            <ul role="log" aria-live="polite" className="max-w-[640px] mx-auto w-full">
                {messages.map((msg, i) => (
                    <div key={msg._id}>
                        {(i === 0 || isDifferentDay(messages[i - 1].createdAt, msg.createdAt)) && (
                            <DateDivider date={msg.createdAt} />
                        )}
                        <MessageBubble message={msg} isOwn={msg.author === currentUser} />
                    </div>
                ))}
            </ul>
        </div>
    );
}
