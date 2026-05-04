import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function AIChat() {
  const {url} = usePage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Financial Advisor. I can help you with budgeting, savings strategies, investment advice, and financial planning. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const aiResponses: Record<string, string> = {
    save: 'Great question! I recommend following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Based on your current balance, you could save around 1,500 DH per month.',
    invest: 'For investment advice, I suggest diversifying your portfolio. Consider low-risk options like savings accounts or bonds, and gradually explore mutual funds. Always consult with a certified financial advisor before making major investment decisions.',
    budget: 'Creating a budget is essential! Track your expenses, categorize them, and identify areas where you can reduce spending. Use the savings simulator feature to see how small daily savings can add up over time.',
    loan: 'Before taking a loan, make sure you understand the interest rates, repayment terms, and total cost. Only borrow what you can comfortably repay. Our bank offers competitive rates - contact customer support for more details.',
    default: 'That\'s an interesting question! I recommend reviewing your transaction history to understand your spending patterns. You can also use our savings simulator to plan your financial goals. Is there a specific aspect of your finances you\'d like to improve?',
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const lowerInput = inputText.toLowerCase();
      let response = aiResponses.default;

      if (lowerInput.includes('save') || lowerInput.includes('saving')) {
        response = aiResponses.save;
      } else if (lowerInput.includes('invest')) {
        response = aiResponses.invest;
      } else if (lowerInput.includes('budget')) {
        response = aiResponses.budget;
      } else if (lowerInput.includes('loan')) {
        response = aiResponses.loan;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputText('');
  };

  const quickQuestions = [
    'How much should I save monthly?',
    'Tips for budgeting?',
    'Investment advice for beginners',
    'Should I take a loan?',
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-orange-600 rounded-xl p-2.5">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">AI Financial Advisor</h1>
                <p className="text-gray-500 mt-1">Get personalized financial advice</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-gray-700">Quick questions to get started:</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(question)}
                    className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-primary hover:bg-orange-50 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-orange-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="mb-1">{message.text}</p>
                  <p className={`text-xs ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your finances..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
