import { memo } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toLabel(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === now.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function DateDivider({ date }: { date: string }) {
    return (
        <li className="flex items-center gap-3 px-6 py-3">
            <hr className="flex-1 border-gray-300" />
            <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{toLabel(date)}</span>
            <hr className="flex-1 border-gray-300" />
        </li>
    );
}

export default memo(DateDivider);
