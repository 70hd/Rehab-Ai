"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* icons unchanged... */

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Typewriter message (calls onTick so we can keep chat scroller pinned)
function TypewriterText({ text, speed = 14, onTick }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    setShown("");

    const t = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);

    return () => clearInterval(t);
  }, [text, speed]);

  useEffect(() => {
    onTick?.();
  }, [shown, onTick]);

  const done = shown.length >= text.length;

  return (
    <span>
      {shown}
      {!done && <span className="tw-caret">▍</span>}

      <style jsx>{`
        .tw-caret {
          display: inline-block;
          width: 8px;
          margin-left: 2px;
          opacity: 0.85;
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </span>
  );
}

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);

  const [input, setInput] = useState("");
  const [deepSearch, setDeepSearch] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: uid(),
      role: "assistant",
      content:
        "Hi — I’m Rehab AI. Tell me what you’re dealing with right now, and I’ll help you take the next step.",
      animate: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Scroll ONLY the chat panel, not the whole page
  const chatRef = useRef(null);

  const scrollChatToBottom = useCallback((behavior = "auto") => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    scrollChatToBottom("auto");
  }, [messages, loading, scrollChatToBottom]);

  const handleTypeTick = useCallback(() => {
    scrollChatToBottom("auto");
  }, [scrollChatToBottom]);

  // Page load animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const sendMessage = async (e) => {
    e?.preventDefault?.();
    setError("");

    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: uid(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, deepSearch }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      const assistantMsg = {
        id: uid(),
        role: "assistant",
        content: data.text || "…",
        animate: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        color: "rgba(255,255,255,0.92)",
        padding: "96px 48px",
        overflow: "visible",
      }}
    >
      <div style={{ maxWidth: 1248, margin: "0 auto" }}>
        {/* Slide-up on load wrapper */}
        <div
          style={{
            transform: mounted ? "translateY(0px)" : "translateY(18px)",
            opacity: mounted ? 1 : 0,
            transition:
              "transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms ease",
            willChange: "transform, opacity",
          }}
        >
          {/* Card gradient stroke */}
          <div
            style={{
              padding: 1,
              borderRadius: 18,
              background:
                "linear-gradient(90deg, rgba(80,220,255,0.55), rgba(255,255,255,0.06), rgba(0,0,0,0))",
            }}
            className="bg-[#121212]"
          >
            {/* OUTER CARD — no overflow hidden (so glow can spill) */}
            <div
              style={{
                position: "relative",
                borderRadius: 17,
                background: "#121212",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
              }}
            >
              {/* Glow layers */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -120,
                  borderRadius: 260,
                  background: `
                    radial-gradient(900px 420px at 18% 8%, rgba(80,220,255,0.42), rgba(0,0,0,0) 65%),
                    radial-gradient(900px 420px at 82% 8%, rgba(120,255,210,0.34), rgba(0,0,0,0) 65%)
                  `,
                  filter: "blur(124px)",
                  opacity: 1,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              {/* INNER CLIP WRAPPER */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  borderRadius: 17,
                  overflow: "hidden",
                  background: "#121212",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontWeight: 650,
                    letterSpacing: "0.2px",
                    color: "rgba(255,255,255,0.85)",
                    background: "rgba(18,18,18,0.85)",
                  }}
                >
                  <p className="small-text">
                    <strong>Rehab AI</strong> 3.0 Thinking
                  </p>
                </div>

                {/* Chat area (ONLY scrolling container) */}
                <div
                  ref={chatRef}
                  style={{
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    height: 492,
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {messages.map((m) => {
                    const isUser = m.role === "user";

                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          justifyContent: isUser ? "flex-end" : "flex-start",
                        }}
                      >
                        {isUser ? (
                          <div
                            style={{
                              maxWidth: 420,
                              padding: "12px 14px",
                              borderRadius: 14,
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.92)",
                              lineHeight: 1.35,
                            }}
                          >
                            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                              {m.content}
                            </p>
                          </div>
                        ) : (
                          <div
                            style={{
                              maxWidth: 520,
                              padding: "4px 2px",
                              color: "rgba(255,255,255,0.88)",
                              lineHeight: 1.45,
                              fontSize: 14,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            <p style={{ margin: 0 }}>
                              {m.animate ? (
                                <TypewriterText
                                  text={m.content}
                                  onTick={handleTypeTick}
                                />
                              ) : (
                                m.content
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {loading && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div
                        style={{
                          maxWidth: 520,
                          padding: "4px 2px",
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {deepSearch ? "Deep thinking…" : "Thinking…"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div
                  style={{
                    padding: "0 18px 18px",
                    background: "rgba(18,18,18,0.6)",
                  }}
                >
                  <form onSubmit={sendMessage} style={{ borderRadius: 16 }}>
                    <div
                      style={{
                        padding: 1,
                        borderRadius: 16,
                        border: "0.5px solid rgba(255,255,255,0.9)",
                        background:
                          "linear-gradient(90deg, rgba(173,247,255,1) 31%, rgba(228,255,242,1) 100%)",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 15,
                          background: "rgba(18,18,18,0.92)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          padding: 14,
                        }}
                      >
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask anything…"
                          rows={3}
                          onKeyDown={(e) => {
                            // Enter sends, Shift+Enter makes newline
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage(e);
                            }
                          }}
                          style={{
                            width: "100%",
                            resize: "none",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "rgba(255,255,255,0.92)",
                            fontSize: 20,
                            lineHeight: 1.35,
                          }}
                        />

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 10,
                          }}
                        >
                          <div style={{ display: "flex", gap: 10 }}>
                            {/* Deep Search toggle */}
                            <button
                              type="button"
                              onClick={() => setDeepSearch((v) => !v)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                height: 30,
                                padding: "0 12px",
                                borderRadius: 999,
                                background: deepSearch
                                  ? "rgba(173,247,255,0.16)"
                                  : "rgba(255,255,255,0.06)",
                                border: deepSearch
                                  ? "1px solid rgba(173,247,255,0.55)"
                                  : "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.88)",
                                cursor: "pointer",
                              }}
                            >
                              <p className="small-text" style={{ margin: 0 }}>
                                {deepSearch ? "Deep Search: On" : "Deep Search"}
                              </p>
                            </button>
                          </div>
                        </div>

                        {error && (
                          <div
                            style={{
                              marginTop: 10,
                              color: "#ff6b6b",
                              fontSize: 13,
                            }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                {/* end input */}
              </div>
              {/* end inner clip */}
            </div>
            {/* end outer card */}
          </div>
          {/* end gradient stroke */}
        </div>
        {/* end slide wrapper */}
      </div>
    </div>
  );
}