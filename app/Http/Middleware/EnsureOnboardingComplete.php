<?php


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingComplete
{
   public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();

    // Admin and branch agents should not pass through client onboarding
    if ($user && in_array($user->role, ['admin', 'agent'])) {
        return $next($request);
    }

    if ($user && !$user->profile) {
        return redirect()->route('onboarding.profile');
    }

    if ($user && !$user->bankAccount) {
        return redirect()->route('onboarding.confirm');
    }

    return $next($request);
}
}
