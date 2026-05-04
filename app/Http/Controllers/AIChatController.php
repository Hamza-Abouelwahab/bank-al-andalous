<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $apiKey = config('services.groq.key');

        if (!$apiKey) {
            return response()->json([
                'answer' => 'Missing GROQ_API_KEY. Check your .env and config/services.php.',
            ], 500);
        }

        $systemInstruction = <<<TEXT
You are Nestora Bank AI assistant.

You ONLY answer questions about:
- bank accounts
- saving goals
- budgeting
- transaction history
- deposits
- withdrawals
- transfers
- loans
- appointments with bank advisors
- card issues
- suspicious activity reports
- account security
- bank support

If the user asks anything outside banking or personal finance, reply exactly:
"I can only help with banking, savings, appointments, transactions, and account support."

Rules:
- Keep answers short and professional.
- Do not answer coding questions.
- Do not answer politics, entertainment, homework, hacking, or random topics.
- Do not guarantee profit from investments.
- For serious financial decisions, tell the user to book an appointment with a bank advisor.
TEXT;

        try {
            $response = Http::withoutVerifying() // local Windows fix
                ->timeout(30)
                ->withToken($apiKey)
                ->acceptJson()
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemInstruction,
                        ],
                        [
                            'role' => 'user',
                            'content' => $request->message,
                        ],
                    ],
                    'temperature' => 0.3,
                    'max_tokens' => 300,
                ]);

            if (!$response->successful()) {
                return response()->json([
                    'answer' => 'Groq error: ' . $response->body(),
                ], 500);
            }

            return response()->json([
                'answer' => $response->json('choices.0.message.content') ?: 'Sorry, I could not answer right now.',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'answer' => 'Laravel error: ' . $e->getMessage(),
            ], 500);
        }
    }
}