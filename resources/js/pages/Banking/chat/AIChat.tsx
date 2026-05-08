import { Head } from '@inertiajs/react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

const QUICK_QUESTIONS = [
    'How much should I save monthly?',
    'Tips for budgeting?',
    'Investment advice for beginners',
    'Should I take a loan?',
];

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([{
        id: '1',
        text: 'Hello! I\'m your Bank Al-Andalous AI financial advisor. I can help you with savings goals, budgeting, transactions, loans, appointments, and account support. How can I help you today?',
        sender: 'ai',
        timestamp: '',
    }]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;
        const messageToSend = inputText.trim();

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: messageToSend,
            sender: 'user',
            timestamp: getTime(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch('/ai-chat/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ message: messageToSend }),
            });

            const text = await response.text();
            let data: { answer?: string; message?: string };
            try { data = JSON.parse(text); } catch { throw new Error(text || 'Invalid server response.'); }
            if (!response.ok) throw new Error(data.answer || data.message || 'Request failed.');

            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                text: data.answer || 'Sorry, I could not answer right now.',
                sender: 'ai',
                timestamp: getTime(),
            }]);
        } catch (error: any) {
            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                text: error.message || 'Sorry, the AI assistant is not available right now.',
                sender: 'ai',
                timestamp: getTime(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Chat Bot" />

            <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#F8F6F1] dark:bg-[#0F0D0B]">



                {/* ── Header ── */}
                <header className="shrink-0 border-b border-orange-100/60 bg-white/90 backdrop-blur dark:border-[#7a2800]/30 dark:bg-[#1f1a17]/90">
                    <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-[#7a2800] shadow-sm">
                            <Bot className="h-5 w-5 text-white" />
                            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-orange-500 dark:border-[#1f1a17]" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-[#1f1a17] dark:text-white">AI Financial Advisor</h1>
                            <p className="text-xs text-orange-600 font-medium dark:text-orange-400">● Online · Responds instantly</p>
                        </div>
                    </div>
                </header>

                {/* ── Messages ── */}
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">

                    {/* Quick questions (only on fresh chat) */}
                    {messages.length === 1 && (
                        <div className="mb-5 animate-fade-in">
                            <div className="mb-3 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-orange-600" />
                                <p className="text-sm font-semibold text-[#1f1a17]/70 dark:text-white/70">Suggested questions:</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {QUICK_QUESTIONS.map((q, i) => (
                                    <button key={i} onClick={() => setInputText(q)}
                                        className="rounded-xl border border-orange-200/60 bg-white px-4 py-3 text-left text-sm text-[#1f1a17] transition hover:border-orange-300 hover:bg-orange-50 dark:border-[#7a2800]/40 dark:bg-[#1f1a17] dark:text-white dark:hover:bg-orange-900/10">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message bubbles */}
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {/* AI avatar */}
                                {msg.sender === 'ai' && (
                                    <div className="mr-2.5 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${msg.sender === 'user'
                                        ? 'rounded-br-sm bg-orange-600 text-white'
                                        : 'rounded-bl-sm border border-orange-100/60 bg-white text-[#1f1a17] dark:border-[#7a2800]/30 dark:bg-[#1f1a17] dark:text-white'
                                    }`}>
                                    <p className="whitespace-pre-line break-words">{msg.text}</p>
                                    {msg.timestamp && (
                                        <p className={`mt-1.5 text-[10px] ${msg.sender === 'user' ? 'text-orange-100' : 'text-[#1f1a17]/60 dark:text-white/60'}`}>
                                            {msg.timestamp}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex animate-fade-in justify-start">
                                <div className="mr-2.5 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                                <div className="rounded-2xl rounded-bl-sm border border-orange-100/60 bg-white px-5 py-3.5 shadow-sm dark:border-[#7a2800]/30 dark:bg-[#1f1a17]">
                                    <div className="flex items-center gap-1.5">
                                        {[0, 150, 300].map((delay) => (
                                            <span key={delay} className="h-2 w-2 rounded-full bg-orange-400"
                                                style={{ animation: `pulse 1.2s ease-in-out ${delay}ms infinite` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* ── Input Bar ── */}
                <div className="shrink-0 border-t border-orange-100/60 bg-white/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4 dark:border-[#7a2800]/30 dark:bg-[#1f1a17]/95">
                    <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-orange-200/60 bg-[#f8f6f1] p-2 shadow-sm dark:border-[#7a2800]/40 dark:bg-[#241b16]">
                        <input type="text" value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                            placeholder="Ask about savings, budgeting, transactions..."
                            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#1f1a17] outline-none placeholder:text-[#1f1a17]/50 dark:text-white dark:placeholder:text-white/50" />
                        <button onClick={handleSend} disabled={!inputText.trim() || isLoading}
                            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 text-white shadow-sm transition hover:bg-[#7a2800] disabled:cursor-not-allowed disabled:opacity-50">
                            <Send className="h-4 w-4" />
                            <span className="hidden text-sm font-semibold sm:inline">{isLoading ? 'Sending…' : 'Send'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>


    );
}
