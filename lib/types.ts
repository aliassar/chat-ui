export interface Message {
    _id: string;
    message: string;
    author: string;
    createdAt: string;
}

export interface ApiError {
    status: number;
    message: string;
}

export interface HealthResponse {
    status: string;
    timestamp: string;
}

export type ConnectionStatus = "connected" | "disconnected" | "connecting";
