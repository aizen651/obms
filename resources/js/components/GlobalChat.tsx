import { useState, useEffect, useRef, useCallback } from "react"
import { router, usePage } from "@inertiajs/react"
import Echo from "laravel-echo"
import Pusher from "pusher-js"
import { MessageCircle, Send, Loader2, Wifi, WifiOff, ChevronDown, Trash2 } from "lucide-react"

interface Message {
    id: string
    userId: number
    username: string
    avatar: string | null
    message: string
    timestamp: string
    isOwn?: boolean
    deleted?: boolean
}

interface AuthUser {
    id: number
    firstname: string
    lastname: string
    user_image: string | null
    is_online: boolean
    last_seen_at: string | null
}

interface PageProps {
    auth?: { user?: AuthUser }
    chatMessages?: Message[]
    [key: string]: unknown
}

const COLORS = [
    { bg: "#38bdf8", tx: "#082f49" }, { bg: "#34d399", tx: "#022c22" },
    { bg: "#a78bfa", tx: "#2e1065" }, { bg: "#f472b6", tx: "#500724" },
    { bg: "#fbbf24", tx: "#451a03" }, { bg: "#22d3ee", tx: "#083344" },
    { bg: "#e879f9", tx: "#4a044e" }, { bg: "#a3e635", tx: "#1a2e05" },
]

const avatarColor = (name: string) =>
    COLORS[Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % COLORS.length]

const initials = (name: string) =>
    name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"

const timeStr = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const getCsrf = () =>
    decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "")

let echoInst: Echo | null = null
function getEcho() {
    if (!echoInst) {
        // @ts-ignore
        window.Pusher = Pusher
        echoInst = new Echo({
            broadcaster:       "reverb",
            key:               import.meta.env.VITE_REVERB_APP_KEY,
            wsHost:            import.meta.env.VITE_REVERB_HOST,
            wsPort:            Number(import.meta.env.VITE_REVERB_PORT ?? 8081),
            wssPort:           Number(import.meta.env.VITE_REVERB_PORT ?? 8081),
            forceTLS:          (import.meta.env.VITE_REVERB_SCHEME ?? "http") === "https",
            enabledTransports: ["ws", "wss"],
        })
    }
    return echoInst
}

type Pos = "solo" | "top" | "mid" | "end"
const getPos = (msgs: Message[], i: number): Pos => {
    const sp = msgs[i - 1]?.username === msgs[i].username
    const sn = msgs[i + 1]?.username === msgs[i].username
    return !sp && !sn ? "solo" : !sp ? "top" : sn ? "mid" : "end"
}

function Avatar({ name, avatar, size, fs, showOnline, isOnline }: {
    name: string; avatar: string | null; size: number; fs: number
    showOnline?: boolean; isOnline?: boolean
}) {
    const { bg, tx } = avatarColor(name)
    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            {avatar ? (
                <img src={avatar} alt={name} title={name}
                    style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
            ) : (
                <div title={name} style={{
                    width: size, height: size, borderRadius: "50%",
                    background: bg, color: tx, fontSize: fs, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    letterSpacing: "0.03em",
                }}>
                    {initials(name)}
                </div>
            )}
            {showOnline && (
                <span style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: size * 0.32, height: size * 0.32,
                    borderRadius: "50%",
                    background: isOnline ? "#4ade80" : "#52525b",
                    // Use a CSS variable for the border so it adapts to light/dark
                    border: "2px solid var(--chat-online-border, #09090b)",
                }} />
            )}
        </div>
    )
}

function DeleteDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="chat-fade fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onCancel}>
            <div className="mx-6 w-full max-w-xs shadow-2xl rounded-2xl p-5
                            bg-white border border-zinc-200
                            dark:bg-zinc-900 dark:border-white/10"
                onClick={e => e.stopPropagation()}>
                <p className="text-sm font-medium text-center mb-1 text-zinc-800 dark:text-zinc-100">
                    Unsend this message?
                </p>
                <p className="text-xs text-center mb-4 text-zinc-400 dark:text-zinc-500">
                    This removes it for everyone.
                </p>
                <div className="flex gap-2">
                    <button onClick={onCancel}
                        className="flex-1 py-2 rounded-xl border text-sm transition-all
                                   border-zinc-200 text-zinc-500 hover:bg-zinc-50
                                   dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="flex-1 py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5
                                   bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100
                                   dark:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/30">
                        <Trash2 size={13} /> Unsend
                    </button>
                </div>
            </div>
        </div>
    )
}

function Bubble({ msg, pos, isOwn, onDelete }: {
    msg: Message; pos: Pos; isOwn: boolean; onDelete: (id: string) => void
}) {
    const [confirm, setConfirm] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showAv   = pos === "solo" || pos === "end"
    const showName = !isOwn && (pos === "solo" || pos === "top")
    const showTime = pos === "solo" || pos === "end"
    const mb       = showTime ? "mb-3" : "mb-[3px]"

    const ownR: Record<Pos, string> = {
        solo: "rounded-2xl rounded-br-sm", top: "rounded-2xl rounded-br-sm",
        mid:  "rounded-2xl rounded-r-sm",  end: "rounded-2xl rounded-tr-sm",
    }
    const othR: Record<Pos, string> = {
        solo: "rounded-2xl rounded-bl-sm", top: "rounded-2xl rounded-bl-sm",
        mid:  "rounded-2xl rounded-l-sm",  end: "rounded-2xl rounded-tl-sm",
    }

    const startPress = () => {
        if (!isOwn || msg.deleted) return
        timer.current = setTimeout(() => setConfirm(true), 500)
    }
    const endPress = () => { if (timer.current) clearTimeout(timer.current) }

    if (msg.deleted) {
        return (
            <div className={`flex items-end gap-2 w-full ${mb} ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                <div style={{ width: 28, height: 28, flexShrink: 0 }} />
                <span className="text-[11px] italic px-1 text-zinc-400 dark:text-zinc-700">Message unsent</span>
            </div>
        )
    }

    return (
        <>
            {confirm && (
                <DeleteDialog
                    onConfirm={() => { onDelete(msg.id); setConfirm(false) }}
                    onCancel={() => setConfirm(false)}
                />
            )}
            <div className={`chat-pop flex items-end gap-2 w-full ${mb} ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                <div style={{ width: 28, height: 28, flexShrink: 0 }}>
                    {showAv && <Avatar name={msg.username} avatar={msg.avatar} size={28} fs={9} />}
                </div>
                <div className={`flex flex-col gap-[3px] max-w-[72%] ${isOwn ? "items-end" : "items-start"}`}>
                    {showName && (
                        <span className="text-[10.5px] font-medium px-1 text-zinc-400 dark:text-zinc-500">
                            {msg.username}
                        </span>
                    )}
                    <div
                        className={`px-3 py-2 text-[13.5px] leading-relaxed break-words whitespace-pre-wrap select-none cursor-default
                            ${isOwn
                                ? `border ${ownR[pos]}
                                   bg-zinc-800 border-zinc-700 text-zinc-100
                                   dark:bg-white/[0.09] dark:border-white/[0.11] dark:text-zinc-100`
                                : `border ${othR[pos]}
                                   bg-zinc-100 border-zinc-200 text-zinc-600
                                   dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-zinc-400`}`}
                        onMouseDown={startPress}
                        onMouseUp={endPress}
                        onMouseLeave={endPress}
                        onTouchStart={startPress}
                        onTouchEnd={endPress}
                        onContextMenu={e => { if (isOwn) { e.preventDefault(); setConfirm(true) } }}
                    >
                        {msg.message}
                    </div>
                    {showTime && (
                        <span className="text-[10px] px-1 text-zinc-400 dark:text-zinc-700">{timeStr(msg.timestamp)}</span>
                    )}
                </div>
            </div>
        </>
    )
}

export default function GlobalChat() {
    const { auth, chatMessages = [] } = usePage<PageProps>().props
    const user = auth?.user
    const me   = user ? `${user.firstname} ${user.lastname}` : "Anonymous"
    const myId = user?.id

    const deletedIds = useRef<Set<string>>(new Set())

    const normalize = (msgs: Message[]) =>
        msgs.map(m => ({
            ...m,
            id: String(m.id),
            isOwn: m.userId === myId,
            deleted: deletedIds.current.has(String(m.id)) ? true : m.deleted,
        }))

    const [msgs, setMsgs]         = useState<Message[]>(() => normalize(chatMessages))
    const [open, setOpen]         = useState(false)
    const [input, setInput]       = useState("")
    const [sending, setSending]   = useState(false)
    const [wsOnline, setWsOnline] = useState(false)
    const [unread, setUnread]     = useState(0)

    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef  = useRef<HTMLInputElement>(null)
    const openRef   = useRef(open)
    openRef.current = open

    useEffect(() => { setMsgs(normalize(chatMessages)) }, [chatMessages])

    const updateStatus = useCallback((status: "online" | "offline") => {
        if (!user) return
        fetch("/chat/status", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-XSRF-TOKEN": getCsrf(),
            },
            body: JSON.stringify({ status }),
        }).catch(() => {})
    }, [user?.id])

    useEffect(() => {
        if (!user) return
        updateStatus("online")
        const onVisibility = () => updateStatus(document.hidden ? "offline" : "online")
        const onUnload     = () => updateStatus("offline")
        document.addEventListener("visibilitychange", onVisibility)
        window.addEventListener("beforeunload", onUnload)
        return () => {
            updateStatus("offline")
            document.removeEventListener("visibilitychange", onVisibility)
            window.removeEventListener("beforeunload", onUnload)
        }
    }, [user?.id])

    useEffect(() => {
        const e = getEcho()
        const p = (e.connector as any).pusher
        p.connection.bind("connected",    () => setWsOnline(true))
        p.connection.bind("disconnected", () => setWsOnline(false))
        p.connection.bind("error",        () => setWsOnline(false))

        e.channel("global-chat")
            .listen(".message.sent", (data: Message) => {
                const msg = { ...data, id: String(data.id), isOwn: data.userId === myId }
                setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg])
                if (!openRef.current) setUnread(n => n + 1)
            })
            .listen(".message.deleted", ({ id }: { id: string }) => {
                deletedIds.current.add(String(id))
                setMsgs(prev => prev.map(m => m.id === String(id) ? { ...m, deleted: true } : m))
            })

        return () => { e.leaveChannel("global-chat") }
    }, [myId])

    useEffect(() => {
        if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60)
    }, [msgs, open])

    useEffect(() => {
        if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100) }
    }, [open])

    const deleteMessage = useCallback((id: string) => {
        fetch(`/chat/messages/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-XSRF-TOKEN": getCsrf(),
            },
        }).catch(() => {})
    }, [])

    function send() {
        const text = input.trim()
        if (!text || sending) return
        setSending(true)
        router.post("/chat/messages", { message: text }, {
            preserveScroll: true,
            preserveState:  true,
            onSuccess: () => { setInput(""); setSending(false) },
            onError:   () => setSending(false),
        })
    }

    const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
        if (e.key === "Escape") setOpen(false)
    }

    const avatarUrl = user?.user_image ? `/storage/${user.user_image}` : null

    return (
        <>
            <style>{`
                @keyframes chat-rise { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:none} }
                @keyframes chat-pop  { from{opacity:0;transform:scale(0.88) translateY(6px)} to{opacity:1;transform:none} }
                @keyframes chat-fade { from{opacity:0} to{opacity:1} }
                .chat-rise { animation: chat-rise 0.28s cubic-bezier(0.22,1,0.36,1) both }
                .chat-pop  { animation: chat-pop 0.18s ease both }
                .chat-fade { animation: chat-fade 0.18s ease both }
                /* Dark scrollbar */
                .chat-scroll::-webkit-scrollbar       { width: 3px }
                .chat-scroll::-webkit-scrollbar-track { background: transparent }
                .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px }
                /* Light scrollbar */
                .light .chat-scroll::-webkit-scrollbar-thumb,
                :root:not(.dark) .chat-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.10) }
                /* Online dot border adapts to mode */
                :root:not(.dark) { --chat-online-border: #f4f4f5 }
                .dark            { --chat-online-border: #09090b }
            `}</style>

            {/* FAB toggle button */}
            {!open && (
                <button onClick={() => setOpen(true)} aria-label="Open chat"
                    className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center rounded-full
                               shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200
                               bg-zinc-900 border border-white/10 shadow-black/70 hover:bg-zinc-800 hover:border-white/20
                               dark:bg-zinc-900 dark:border-white/10 dark:shadow-black/70 dark:hover:bg-zinc-800 dark:hover:border-white/20"
                    style={{ width: 52, height: 52 }}>
                    <MessageCircle size={20} className="text-zinc-600 dark:text-white/60" />
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500
                                         text-white text-[10px] font-bold rounded-full flex items-center
                                         justify-center border-2 border-zinc-100 dark:border-zinc-950">
                            {unread > 9 ? "9+" : unread}
                        </span>
                    )}
                    {wsOnline && (
                        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full animate-pulse
                                         bg-emerald-400 border-2 border-zinc-100 dark:border-zinc-900" />
                    )}
                </button>
            )}

            {/* Backdrop */}
            {open && (
                <div className="chat-fade fixed inset-0 z-[9997] bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpen(false)} />
            )}

            {/* Chat panel */}
            {open && (
                <div role="dialog" aria-label="Global Chat"
                    className="chat-rise fixed z-[9998] flex flex-col overflow-hidden
                               shadow-[0_32px_80px_rgba(0,0,0,0.85)]
                               inset-0 rounded-none
                               sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[390px] sm:h-[580px] sm:rounded-2xl
                               bg-zinc-50 border border-zinc-200
                               dark:bg-zinc-950 dark:border-white/[0.07]">

                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b flex-shrink-0
                                    bg-white border-zinc-200
                                    dark:bg-white/[0.015] dark:border-white/[0.06]">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-500
                            ${wsOnline
                                ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)]"
                                : "bg-zinc-300 dark:bg-zinc-600"}`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                                Global Chat
                            </p>
                            <p className="text-[10.5px] mt-px flex items-center gap-1 text-zinc-400 dark:text-zinc-600">
                                {wsOnline
                                    ? <><Wifi size={9} className="text-emerald-500" /> Live · everyone online</>
                                    : <><WifiOff size={9} /> Connecting…</>}
                            </p>
                        </div>
                        {user && (
                            <div className="flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 max-w-[140px] flex-shrink-0 border
                                            bg-zinc-100 border-zinc-200
                                            dark:bg-white/[0.04] dark:border-white/[0.07]">
                                <Avatar name={me} avatar={avatarUrl} size={20} fs={8} showOnline isOnline={true} />
                                <span className="text-[11px] font-medium truncate text-zinc-500 dark:text-zinc-500">{me}</span>
                            </div>
                        )}
                        <button onClick={() => setOpen(false)}
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all
                                       text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100
                                       dark:text-zinc-600 dark:hover:text-zinc-300 dark:hover:bg-white/[0.06]">
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-scroll flex-1 overflow-y-auto px-3.5 pt-4 pb-2 flex flex-col">
                        {!user ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
                                <MessageCircle size={32} className="text-zinc-300 dark:text-zinc-700" />
                                <p className="text-sm text-zinc-400 dark:text-zinc-600">
                                    Please <a href="/login" className="underline transition-colors
                                        text-zinc-600 hover:text-zinc-900
                                        dark:text-zinc-400 dark:hover:text-zinc-200">log in</a> to chat.
                                </p>
                            </div>
                        ) : msgs.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
                                <MessageCircle size={32} className="text-zinc-300 dark:text-zinc-700" />
                                <p className="text-sm text-zinc-400 dark:text-zinc-600">
                                    No messages yet.<br />
                                    <span className="text-zinc-500">Be the first to say hello 👋</span>
                                </p>
                            </div>
                        ) : (
                            msgs.map((msg, i) => (
                                <Bubble key={msg.id} msg={msg} pos={getPos(msgs, i)}
                                    isOwn={!!msg.isOwn} onDelete={deleteMessage} />
                            ))
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input bar */}
                    {user && (
                        <div className="flex items-center gap-2.5 px-3.5 py-3 pb-4 border-t flex-shrink-0
                                        bg-zinc-100 border-zinc-200
                                        dark:bg-black/20 dark:border-white/[0.05]">
                            <Avatar name={me} avatar={avatarUrl} size={28} fs={9} />
                            <input ref={inputRef} value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={onKey}
                                placeholder="Message everyone…"
                                maxLength={500} disabled={sending}
                                className="flex-1 rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none transition-colors disabled:opacity-50 border
                                           bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400
                                           dark:bg-white/[0.05] dark:border-white/[0.09] dark:text-zinc-100 dark:placeholder:text-zinc-700 dark:focus:border-white/20" />
                            <button onClick={send} disabled={!input.trim() || sending}
                                className={`flex-shrink-0 flex items-center justify-center rounded-xl border transition-all active:scale-90
                                    ${input.trim() && !sending
                                        ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 cursor-pointer dark:bg-white/10 dark:border-white/[0.15] dark:hover:bg-white/[0.16]"
                                        : "bg-zinc-100 border-zinc-200 cursor-not-allowed dark:bg-white/[0.03] dark:border-white/[0.04]"}`}
                                style={{ width: 38, height: 38 }}>
                                {sending
                                    ? <Loader2 size={14} className="text-zinc-400 dark:text-zinc-600 animate-spin" />
                                    : <Send size={13} className={input.trim()
                                        ? "text-white dark:text-zinc-300"
                                        : "text-zinc-400 dark:text-zinc-700"} />}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}