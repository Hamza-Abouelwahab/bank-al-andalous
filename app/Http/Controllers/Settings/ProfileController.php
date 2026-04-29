<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'date_of_birth' => 'required|date',
            'phone'         => 'required|string',
            'address'       => 'required|string',
        ]);

        $request->user()->update([
            'date_of_birth' => $request->date_of_birth,
            'phone'         => $request->phone,
            'address'       => $request->address,
        ]);

        return redirect()->route('onboarding.profile'); 
    }
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load(['profile', 'bankAccount', 'financialProfile']);

        return Inertia::render('settings/profile', [
            'mustVerifyEmail'  => $request->user() instanceof MustVerifyEmail,
            'status'           => $request->session()->get('status'),
            'profile'          => $user->profile,
            'bankAccount'      => $user->bankAccount,
            'financialProfile' => $user->financialProfile,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->fill([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if (isset($validated['phone']) || isset($validated['address'])) {
            $request->user()->profile()->updateOrCreate(
                ['user_id' => $request->user()->id],
                array_filter([
                    'phone'   => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                ], fn($v) => $v !== null)
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
