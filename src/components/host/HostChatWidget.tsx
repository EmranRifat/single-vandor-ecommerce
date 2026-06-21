"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "user" | "host";
  text: string;
  time: string;
};

type SocketLike = {
  connected?: boolean;
  emit: (event: string, payload: unknown) => void;
  on: (event: string, callback: (payload: unknown) => void) => void;
  off: (event: string, callback: (payload: unknown) => void) => void;
  disconnect: () => void;
};

declare global {
  interface Window {
    io?: (url: string, options?: Record<string, unknown>) => SocketLike;
  }
}

const socketUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL;

const createMessage = (
  sender: ChatMessage["sender"],
  text: string,
): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  sender,
  text,
  time: new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date()),
});

const getBotReply = (message: string) => {
  const value = message.toLowerCase();

  if (
    value.includes("hello") ||
    value.includes("hi") ||
    value.includes("hey")
  ) {
    return "Hello! I can help you with hosting, pricing, photos, availability, approval, and listing setup.";
  }

  if (
    value.includes("rent") ||
    value.includes("income") ||
    value.includes("earn") ||
    value.includes("price") ||
    value.includes("pricing") ||
    value.includes("cost")
  ) {
    return "Your earning depends on location, property type, and nightly rent. Start setup and add rent per night so we can review it.";
  }

  if (
    value.includes("document") ||
    value.includes("need") ||
    value.includes("require") ||
    value.includes("required")
  ) {
    return "You need property details, available dates, photos, rent per night, and basic contact information.";
  }

  if (
    value.includes("review") ||
    value.includes("approve") ||
    value.includes("approval") ||
    value.includes("pending")
  ) {
    return "After submission, the admin team reviews your listing before it appears publicly.";
  }

  if (
    value.includes("photo") ||
    value.includes("image") ||
    value.includes("picture")
  ) {
    return "Upload clear photos of the room, bed, bathroom, entrance, and any special facilities. Good photos help guests trust your listing.";
  }

  if (
    value.includes("location") ||
    value.includes("address") ||
    value.includes("area")
  ) {
    return "Add the accurate property location and area details. This helps guests understand where they will stay before booking.";
  }

  if (
    value.includes("date") ||
    value.includes("available") ||
    value.includes("availability") ||
    value.includes("calendar")
  ) {
    return "You can choose the dates your property is available. Keep availability updated so guests only book open dates.";
  }

  if (
    value.includes("facility") ||
    value.includes("facilities") ||
    value.includes("wifi") ||
    value.includes("parking") ||
    value.includes("ac")
  ) {
    return "Add every available facility like Wi-Fi, AC, parking, kitchen, hot water, or security. Facilities make your listing easier to compare.";
  }

  if (
    value.includes("payment") ||
    value.includes("paid") ||
    value.includes("money")
  ) {
    return "Payment details are handled after booking confirmation. Make sure your listing price is correct before submitting.";
  }

  if (
    value.includes("edit") ||
    value.includes("update") ||
    value.includes("change")
  ) {
    return "You can update listing details from the dashboard after the listing is created, depending on your account permissions.";
  }

  if (
    value.includes("delete") ||
    value.includes("remove") ||
    value.includes("cancel")
  ) {
    return "If you need to remove or cancel a listing, check your dashboard listing actions or contact admin support.";
  }

  if (
    value.includes("safe") ||
    value.includes("security") ||
    value.includes("guest")
  ) {
    return "Use clear house rules, accurate details, and secure communication. Admin review also helps keep listings trustworthy.";
  }

  if (
    value.includes("start") ||
    value.includes("setup") ||
    value.includes("list") ||
    value.includes("hosting")
  ) {
    return "Click Start Hosting Now, then fill in property details, rent, photos, facilities, and available dates to submit your listing.";
  }

  return "Thanks for your message. Tell me about your property, location, or listing question and I will help you get started.";
};

export default function HostChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "host",
      "Hi, I can help you start hosting. Ask me about rent, documents, or listing approval.",
    ),
  ]);
  const [connectionStatus, setConnectionStatus] = useState<
    "offline" | "connecting" | "connected"
  >("offline");
  const socketRef = useRef<SocketLike | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!socketUrl) {
      return;
    }

    let isMounted = true;
    let scriptElement: HTMLScriptElement | null = null;

    const handleReply = (payload: unknown) => {
      if (!isMounted) {
        return;
      }

      const text =
        typeof payload === "string"
          ? payload
          : typeof payload === "object" &&
              payload !== null &&
              "message" in payload
            ? String((payload as { message: unknown }).message)
            : "";

      if (text) {
        setMessages((current) => [...current, createMessage("host", text)]);
      }
    };

    const connectSocket = () => {
      if (!window.io || socketRef.current) {
        return;
      }

      setConnectionStatus("connecting");
      const socket = window.io(socketUrl, {
        transports: ["websocket"],
      });

      socketRef.current = socket;
      socket.on("connect", () => setConnectionStatus("connected"));
      socket.on("disconnect", () => setConnectionStatus("offline"));
      socket.on("host:reply", handleReply);
      socket.on("chat:message", handleReply);
    };

    if (window.io) {
      connectSocket();
    } else {
      scriptElement = document.createElement("script");
      scriptElement.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
      scriptElement.async = true;
      scriptElement.onload = connectSocket;
      document.body.appendChild(scriptElement);
    }

    return () => {
      isMounted = false;

      if (socketRef.current) {
        socketRef.current.off("host:reply", handleReply);
        socketRef.current.off("chat:message", handleReply);
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      if (scriptElement?.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = inputValue.trim();
    if (!text) {
      return;
    }

    setInputValue("");
    setMessages((current) => [...current, createMessage("user", text)]);

    if (socketRef.current?.connected) {
      socketRef.current.emit("host:message", {
        message: text,
        page: "become-a-host",
      });
      return;
    }

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        createMessage("host", getBotReply(text)),
      ]);
    }, 500);
  };

  const sendQuickMessage = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="relative flex w-full justify-center sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-8 text-lg font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 sm:w-auto"
      >
        <MessageCircle className="h-6 w-6" />
        Chat with Host
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 z-30 max-h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-0 sm:left-120 sm:w-[min(92vw,380px)]">
          <div className="flex items-center justify-between bg-gray-950 px-5 py-4 text-white">
            <div>
              <h2 className="text-base font-bold">Host Support Chat</h2>
              <p className="text-xs text-gray-300">
                {connectionStatus === "connected"
                  ? "Live support connected"
                  : "Smart assistant ready"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2 text-sm leading-6 ${
                    message.sender === "user"
                      ? "bg-pink-500 text-white"
                      : "border border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      message.sender === "user"
                        ? "text-pink-100"
                        : "text-gray-400"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3">
            {[
              "How much can I earn?",
              "What documents need?",
              "Approval time?",
              "How to add photos?",
              "How to set availability?",
            ].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => sendQuickMessage(item)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition hover:border-pink-300 hover:text-pink-600"
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-gray-100 p-4"
          >
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type your message..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
            <button
              type="submit"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500 text-white transition hover:bg-pink-600"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
