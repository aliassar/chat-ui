"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { messagesApi, healthApi } from "@/lib/api";
import { logger } from "@/lib/logger";
import { POLL_INTERVAL, MAX_CONSECUTIVE_FAILURES } from "@/constants";
import type { Message, ApiError, ConnectionStatus } from "@/lib/types";

const USER_KEY = "chat-user";
const userListeners = new Set<() => void>();

// the saved name lives in localStorage; "storage" covers other tabs, userListeners this one
function subscribeUser(onChange: () => void) {
    userListeners.add(onChange);
    window.addEventListener("storage", onChange);
    return () => {
        userListeners.delete(onChange);
        window.removeEventListener("storage", onChange);
    };
}

type LoadResult = { messages: Message[] } | { error: ApiError; offline?: boolean };

async function loadMessages(): Promise<LoadResult> {
    // check server first
    try {
        await healthApi.check();
    } catch {
        return { error: { status: 0, message: "Cannot reach the server. Is it running?" }, offline: true };
    }

    try {
        return { messages: await messagesApi.getAll() };
    } catch (err) {
        return { error: err as ApiError };
    }
}

export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
    const currentUser = useSyncExternalStore(
        subscribeUser,
        () => localStorage.getItem(USER_KEY) ?? "",
        () => "",
    );
    const failCount = useRef(0);

    const setCurrentUser = useCallback((name: string) => {
        localStorage.setItem(USER_KEY, name);
        userListeners.forEach(notify => notify());
    }, []);

    const applyLoad = useCallback((result: LoadResult) => {
        if ("messages" in result) {
            setMessages(result.messages);
            setConnectionStatus("connected");
        } else {
            setError(result.error);
            if (result.offline) setConnectionStatus("disconnected");
        }
        setIsLoading(false);
    }, []);

    // initial state is already loading with no error, so only a retry needs to reset it
    const retry = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        applyLoad(await loadMessages());
    }, [applyLoad]);

    useEffect(() => {
        loadMessages().then(applyLoad);
    }, [applyLoad]);

    useEffect(() => {
        if (isLoading || error) return;

        // poll for new messages
        const id = setInterval(async () => {
            try {
                const cursor = messages[messages.length - 1]?.createdAt;
                const fresh = await messagesApi.getAll(cursor ? { after: cursor } : undefined);
                if (fresh.length > 0) {
                    setMessages(prev => [...prev, ...fresh]);
                    logger.debug("poll got", fresh.length, "new");
                }
                failCount.current = 0;
                setConnectionStatus("connected");
            } catch {
                failCount.current++;
                logger.warn("poll failed", failCount.current);
                if (failCount.current >= MAX_CONSECUTIVE_FAILURES) {
                    setConnectionStatus("disconnected");
                }
            }
        }, POLL_INTERVAL);

        return () => clearInterval(id);
    }, [messages, isLoading, error]);

    const sendMessage = useCallback(async (text: string) => {
        const temp: Message = {
            _id: `temp-${Date.now()}`,
            message: text,
            author: currentUser,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, temp]);

        try {
            const saved = await messagesApi.send(text, currentUser);
            setMessages(prev => prev.map(m => m._id === temp._id ? saved : m));
        } catch (err) {
            // rollback on failure
            setMessages(prev => prev.filter(m => m._id !== temp._id));
            throw err;
        }
    }, [currentUser]);

    return {
        messages,
        isLoading,
        error,
        connectionStatus,
        currentUser,
        sendMessage,
        setCurrentUser,
        retry,
    };
}
