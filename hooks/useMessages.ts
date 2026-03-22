"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { messagesApi, healthApi } from "@/lib/api";
import { logger } from "@/lib/logger";
import { POLL_INTERVAL, MAX_CONSECUTIVE_FAILURES } from "@/constants";
import type { Message, ApiError, ConnectionStatus } from "@/lib/types";

export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
    const [currentUser, setCurrentUserState] = useState("");
    const failCount = useRef(0);

    useEffect(() => {
        const saved = localStorage.getItem("chat-user");
        if (saved) setCurrentUserState(saved);
    }, []);

    const setCurrentUser = useCallback((name: string) => {
        setCurrentUserState(name);
        localStorage.setItem("chat-user", name);
    }, []);

    const loadMessages = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // check server first
        try {
            await healthApi.check();
        } catch {
            setError({ status: 0, message: "Cannot reach the server. Is it running?" });
            setConnectionStatus("disconnected");
            setIsLoading(false);
            return;
        }

        try {
            const data = await messagesApi.getAll();
            setMessages(data);
            setConnectionStatus("connected");
        } catch (err) {
            setError(err as ApiError);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

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
        retry: loadMessages,
    };
}
