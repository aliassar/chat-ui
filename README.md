# Doodle Chat

[![ci](https://github.com/aliassar/chat-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/aliassar/chat-ui/actions/workflows/ci.yml)

Next.js 16, React 19, TypeScript, Tailwind 4, Axios

## How it works

```
page.tsx → ChatPage
                ├── ChatHeader
                ├── ConnectionBanner
                ├── MessageList
                │       ├── DateDivider
                │       └── MessageBubble
                └── MessageInput

useMessages ──→ lib/api (axios) ──→ Backend
```

`useMessages` handles all the data — fetching, polling, sending. Everything else just gets props.

## Why I did things this way

Went with polling (3s interval) because the backend is REST-only. I grab new messages using `?after=lastTimestamp` so I'm not refetching the whole list each time. Works fine for the scale of this app, for real-time I'd swap to websockets inside the hook without touching any components.

Props over Context — there's only one screen and one level of nesting, Context would be overkill here.

Optimistic updates on send so it feels fast. If the POST fails it rolls back and keeps the text in the input (losing your message on a network blip would be annoying).

Auth token goes straight into the axios instance headers since it's a static token from the env. The health endpoint sets `Authorization: undefined` to skip it.

axios-retry handles transient failures with exponential backoff. After 3 failed polls in a row the banner shows up so the user knows what's going on.

I check `/health` before fetching messages on first load. Lets me tell the user "server is down" instead of some cryptic error.

Validation limits (500 chars message, 50 chars name) match what the backend enforces with Zod. No point sending a request that's going to fail.
