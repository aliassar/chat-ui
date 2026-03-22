import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageInput from "@/components/chat/MessageInput";

describe("MessageInput", () => {
    it("renders with disabled send when empty", () => {
        render(<MessageInput onSend={jest.fn()} />);
        expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
        expect(screen.getByText("Send").closest("button")).toBeDisabled();
    });

    it("enables send when text is entered", () => {
        render(<MessageInput onSend={jest.fn()} />);
        fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "hi" } });
        expect(screen.getByText("Send").closest("button")).not.toBeDisabled();
    });

    it("calls onSend with trimmed text and clears input", async () => {
        const onSend = jest.fn().mockResolvedValue(undefined);
        render(<MessageInput onSend={onSend} />);

        fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "  hello  " } });
        fireEvent.submit(screen.getByPlaceholderText("Message").closest("form")!);

        await waitFor(() => expect(onSend).toHaveBeenCalledWith("hello"));
        await waitFor(() => expect(screen.getByPlaceholderText("Message")).toHaveValue(""));
    });

    it("keeps text in input when send fails", async () => {
        const onSend = jest.fn().mockRejectedValue(new Error("network"));
        render(<MessageInput onSend={onSend} />);

        const input = screen.getByPlaceholderText("Message");
        fireEvent.change(input, { target: { value: "important msg" } });
        fireEvent.submit(input.closest("form")!);

        await waitFor(() => expect(screen.getByText(/failed to send/i)).toBeInTheDocument());
        expect(input).toHaveValue("important msg");
    });

    it("shows validation error for messages exceeding limit", () => {
        render(<MessageInput onSend={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "x".repeat(501) } });
        fireEvent.submit(screen.getByPlaceholderText("Message").closest("form")!);

        expect(screen.getByText(/500/)).toBeInTheDocument();
    });
});
