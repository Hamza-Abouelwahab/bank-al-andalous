<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'avatar' => ['nullable', 'image', 'max:2048'],
        ])->validate();

        

        $avatarPath = null;

        // 🔥 HANDLE FILE UPLOAD (Fortify way)
        if (isset($input['avatar']) && $input['avatar'] instanceof UploadedFile) {
        $avatarPath = $input['avatar']->store('avatars', 'public');
    }

        


        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'avatar' => $avatarPath, 
        ]);

        
    }
}
