import type { ConnectionStatus } from "@/lib/types";

export default function ConnectionBanner({ status }: { status: ConnectionStatus }) {
    if (status !== "disconnected") return null;

    return (
        <div className="bg-amber-50 text-amber-800 px-4 py-2 text-xs text-center border-b border-amber-200">
            Connection lost. Trying to reconnect...
        </div>
    );
}
