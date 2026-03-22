"use client";

import { useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import { validateAuthor } from "@/lib/validation";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ConnectionBanner from "./ConnectionBanner";

export default function ChatPage() {
    const {
        messages, isLoading, error, connectionStatus,
        currentUser, sendMessage, setCurrentUser, retry,
    } = useMessages();
    const [nameInput, setNameInput] = useState("");
    const [nameError, setNameError] = useState("");

    if (!currentUser) {
        const handleJoin = (e: React.FormEvent) => {
            e.preventDefault();
            const err = validateAuthor(nameInput);
            if (err) { setNameError(err); return; }
            setCurrentUser(nameInput.trim());
        };

        return (
            <div className="chat-bg flex items-center justify-center h-dvh">
                <form onSubmit={handleJoin} className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm mx-4">
                    <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: "var(--color-primary)" }}>
                        Welcome to Doodle Chat
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">Enter your name to start chatting</p>
                    {nameError && <p className="text-red-500 text-xs mb-2">{nameError}</p>}
                    <input
                        type="text"
                        value={nameInput}
                        onChange={e => { setNameInput(e.target.value); setNameError(""); }}
                        placeholder="Your name..."
                        autoFocus
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <button
                        type="submit"
                        disabled={!nameInput.trim()}
                        className="w-full py-2 rounded text-white font-medium text-sm disabled:opacity-50 transition-colors"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        Join Chat
                    </button>
                </form>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="chat-bg flex flex-col h-dvh">
                <ChatHeader />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-400 text-sm">Loading messages...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-bg flex flex-col h-dvh">
                <ChatHeader />
                <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
                    <p className="text-gray-600 text-sm text-center">{error.message}</p>
                    <button
                        onClick={retry}
                        className="px-4 py-2 rounded text-white text-sm font-medium transition-colors"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-bg flex flex-col h-dvh">
            <ChatHeader />
            <ConnectionBanner status={connectionStatus} />
            <MessageList messages={messages} currentUser={currentUser} />
            <MessageInput onSend={sendMessage} />
        </div>
    );
}
