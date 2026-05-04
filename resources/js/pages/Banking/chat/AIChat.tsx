import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I am your Nestora Bank AI assistant. I can help with savings goals, budgeting, transactions, loans, appointments, and account support. How can I help you today?',
            sender: 'ai',
            timestamp: '',
        },
    ]);

    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getTime = () =>
        new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const messageToSend = inputText.trim();

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: messageToSend,
            sender: 'user',
            timestamp: getTime(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch('/ai-chat/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: messageToSend,
                }),
            });

            const text = await response.text();

            let data: { answer?: string; message?: string };

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(text || 'Invalid server response.');
            }

            if (!response.ok) {
                throw new Error(data.answer || data.message || 'Request failed.');
            }

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                text: data.answer || 'Sorry, I could not answer right now.',
                sender: 'ai',
                timestamp: getTime(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                text:
                    error.message ||
                    'Sorry, the AI assistant is not available right now.',
                sender: 'ai',
                timestamp: getTime(),
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickQuestions = [
        'How much should I save monthly?',
        'Tips for budgeting?',
        'Investment advice for beginners',
        'Should I take a loan?',
    ];

    return (
        <div className="flex h-[100dvh] min-w-0 overflow-hidden bg-gray-50">
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="shrink-0 border-b border-gray-200 bg-white">
                    <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600">
                                <Bot className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-base font-semibold text-gray-900 sm:text-xl">
                                    AI Financial Advisor
                                </h1>
                                <p className="mt-0.5 truncate text-sm text-gray-500 sm:text-base">
                                    Get personalized financial advice
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Body */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                        {messages.length === 1 && (
                            <div className="mb-5">
                                <div className="mb-3 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                    <p className="text-sm text-gray-700 sm:text-base">
                                        Quick questions to get started:
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setInputText(question)}
                                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-primary hover:bg-orange-50 sm:text-base"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[78%] sm:px-5 sm:text-base ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-r from-[#1f1a17] to-orange-600 text-white'
                                                : 'border border-gray-200 bg-white text-gray-800'
                                        }`}
                                    >
                                        <p className="whitespace-pre-line break-words">
                                            {message.text}
                                        </p>

                                        {message.timestamp && (
                                            <p
                                                className={`mt-2 text-xs ${
                                                    message.sender === 'user'
                                                        ? 'text-orange-100'
                                                        : 'text-gray-500'
                                                }`}
                                            >
                                                {message.timestamp}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-500 shadow-sm sm:text-base">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input */}
                    <div className="shrink-0 border-t border-gray-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4 lg:px-8">
                        <div className="mx-auto flex max-w-5xl items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm sm:gap-3 sm:p-3">
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask about savings, transactions, loans..."
                                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary sm:px-4 sm:text-base"
                            />

                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim() || isLoading}
                                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f1a17] to-orange-600 px-4 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                            >
                                <Send className="h-5 w-5" />
                                <span className="hidden font-medium sm:inline">
                                    {isLoading ? 'Sending...' : 'Send'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}