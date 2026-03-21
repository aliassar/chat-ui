import { API_BASE, AUTH_TOKEN, REQUEST_TIMEOUT } from "@/constants";
import { logger } from "./logger";
import type { Message, HealthResponse, ApiError } from "./types";
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";

const instance = axios.create({
    baseURL: API_BASE,
    timeout: REQUEST_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
    },
});

axiosRetry(instance, { retryDelay: axiosRetry.exponentialDelay, retries: 3 });

instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status ?? 0;
        const data = error.response?.data as Record<string, unknown> | undefined;

        let msg = "Something went wrong";
        if (data) {
            if (typeof data.message === "string") msg = data.message;
            else if (data.error && typeof (data.error as Record<string, unknown>).message === "string")
                msg = (data.error as Record<string, unknown>).message as string;
        }
        if (status === 0) msg = "Cannot reach the server";

        logger.error("API error", { status, msg });
        return Promise.reject({ status, message: msg } satisfies ApiError);
    }
);

export const messagesApi = {
    getAll: async (params?: { after?: string; before?: string; limit?: number }) => {
        const res = await instance.get<Message[]>("/api/v1/messages", { params });
        return res.data;
    },
    send: async (message: string, author: string) => {
        const res = await instance.post<Message>("/api/v1/messages", { message, author });
        return res.data;
    },
};

// health endpoint doesn't need auth
export const healthApi = {
    check: async () => {
        const res = await instance.get<HealthResponse>("/health", {
            headers: { Authorization: undefined },
        });
        return res.data;
    },
};
