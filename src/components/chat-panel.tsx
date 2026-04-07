"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ArrowLeft, Send } from "lucide-react";
import { cn } from "~/lib/utils";

interface ChatPanelProps {
  currentPlayerId: Id<"players">;
  onClose: () => void;
  initialContactId?: Id<"players"> | null;
}

export function ChatPanel({
  currentPlayerId,
  onClose,
  initialContactId,
}: ChatPanelProps) {
  const [selectedContact, setSelectedContact] = useState<Id<"players"> | null>(
    initialContactId ?? null,
  );

  const chatList = useQuery(api.messages.getChatList);

  return (
    <div className="flex h-full flex-col">
      {selectedContact ? (
        <ConversationView
          currentPlayerId={currentPlayerId}
          contactId={selectedContact}
          onBack={() => setSelectedContact(null)}
        />
      ) : (
        <ChatListView
          chatList={chatList ?? []}
          onSelect={setSelectedContact}
          onClose={onClose}
        />
      )}
    </div>
  );
}

// --- Chat list view ---

interface ChatEntry {
  player: {
    _id: Id<"players">;
    username: string;
    isOnline: boolean;
    rank: string;
    division?: string;
  };
  lastMessage: {
    body: string;
    time: number;
    isMe: boolean;
  } | null;
}

function ChatListView({
  chatList,
  onSelect,
  onClose,
}: {
  chatList: ChatEntry[];
  onSelect: (id: Id<"players">) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? chatList.filter((c) =>
        c.player.username.toLowerCase().includes(search.toLowerCase()),
      )
    : chatList;

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-semibold text-white">Mensajes</h2>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 pt-3 pb-2">
        <input
          type="text"
          placeholder="Buscar conversación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            {search ? "Sin resultados" : "No tenés conversaciones aún"}
          </p>
        )}
        {filtered.map((entry) => (
          <button
            key={entry.player._id}
            type="button"
            onClick={() => onSelect(entry.player._id)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-700/30"
          >
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-sm font-bold text-white">
                {entry.player.username.charAt(0).toUpperCase()}
              </div>
              {entry.player.isOnline && (
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-800" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-200">
                {entry.player.username}
              </p>
              {entry.lastMessage ? (
                <p className="truncate text-xs text-slate-500">
                  {entry.lastMessage.isMe ? "Tú: " : ""}
                  {entry.lastMessage.body}
                </p>
              ) : (
                <p className="text-xs text-slate-600">Sin mensajes</p>
              )}
            </div>
            {entry.lastMessage && (
              <span className="shrink-0 text-[10px] text-slate-600">
                {formatTime(entry.lastMessage.time)}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

// --- Conversation view ---

function ConversationView({
  currentPlayerId,
  contactId,
  onBack,
}: {
  currentPlayerId: Id<"players">;
  contactId: Id<"players">;
  onBack: () => void;
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useQuery(api.messages.getConversation, {
    otherPlayerId: contactId,
  });
  const contact = useQuery(api.players.getPlayer, { playerId: contactId });
  const sendMessage = useMutation(api.messages.send);

  const contactName = contact?.username ?? "...";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const body = input;
    setInput("");
    await sendMessage({ receiverId: contactId, body });
  };

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-slate-700/50 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-xs font-bold text-white">
            {contactName.charAt(0).toUpperCase()}
          </div>
          {contact?.isOnline && (
            <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-slate-800" />
          )}
        </div>
        <span className="text-sm font-semibold text-white">{contactName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {(!messages || messages.length === 0) && (
          <p className="py-12 text-center text-sm text-slate-600">
            Empezá la conversación!
          </p>
        )}
        {messages?.map((msg) => {
          const isMe = msg.senderId === currentPlayerId;
          return (
            <div
              key={msg._id}
              className={cn(
                "mb-2 flex",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                  isMe
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-slate-700 text-slate-200",
                )}
              >
                <p className="break-words">{msg.body}</p>
                <p
                  className={cn(
                    "mt-0.5 text-right text-[10px]",
                    isMe ? "text-blue-200/60" : "text-slate-500",
                  )}
                >
                  {formatTime(msg._creationTime)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-700/50 px-3 py-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="flex-1 rounded-xl border border-slate-600/50 bg-slate-700/50 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "ahora";
  if (diffMins < 60) return `${diffMins}m`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}
