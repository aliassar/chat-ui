import { memo } from "react";

function ChatHeader() {
    return (
        <header
            className="flex items-center px-6 py-3 shadow-sm z-10"
            style={{ backgroundColor: "var(--color-primary)" }}
        >
            <h1 className="text-lg font-semibold text-white tracking-wide">
                Doodle Chat
            </h1>
        </header>
    );
}

export default memo(ChatHeader);
