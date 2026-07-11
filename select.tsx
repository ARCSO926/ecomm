import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { groqChat, type ChatMessage } from "@/lib/groq";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";

type DisplayMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Shelfie's friendly AI shopping assistant. Help the shopper find
products, compare options, and answer questions about sizing, shipping, and returns in 2-4
sentences. Keep replies concise, warm, and focused on helping them decide. If you don't know a
specific fact (like exact stock), suggest they check the product page.`;

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: "assistant", content: "Hi! I'm your Shelfie shopping assistant. Looking for something specific today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cartItems = useCartStore((s) => s.items);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const nextMessages: DisplayMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const cartSummary = cartItems.length
        ? `The shopper currently has these items in their cart: ${cartItems
            .map((i) => `${i.quantity}x ${i.product.name}`)
            .join(", ")}.`
        : "The shopper's cart is currently empty.";

      const chatHistory: ChatMessage[] = [
        { role: "system", content: `${SYSTEM_PROMPT}\n${cartSummary}` },
        ...nextMessages.map((m) => ({ role: m.role, content: m.content } as ChatMessage)),
      ];

      let reply: string;
      try {
        // Preferred: route through Supabase Edge Function (keeps Groq key server-side)
        const { data, error } = await supabase.functions.invoke("ai-chat", {
          body: { messages: chatHistory },
        });
        if (error) throw error;
        reply = data.reply;
      } catch {
        // Fallback: direct client-side call (requires VITE_GROQ_API_KEY)
        reply = await groqChat(chatHistory);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        aria-label="Open shopping assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-xl border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b bg-primary px-4 py-3 text-primary-foreground">
            <Bot className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Shelfie Assistant</p>
              <p className="text-xs opacity-80">Powered by Groq AI</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about products..."
              disabled={isLoading}
            />
            <Button size="icon" onClick={send} disabled={isLoading} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
