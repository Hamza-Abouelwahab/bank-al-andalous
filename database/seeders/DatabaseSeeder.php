<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // AdminSeeder::class ;
        $branches = [
            ['name' => 'Agence Bernoussi', 'email' => 'bernoussi@al-andalous.test'],
            ['name' => 'Agence Hay Moulay Rachid', 'email' => 'moulayrachid@al-andalous.test'],
            ['name' => 'Agence Hay Mohammadi', 'email' => 'haymohammadi@al-andalous.test'],
            ['name' => 'Agence Sidi Moumen', 'email' => 'sidimoumen@al-andalous.test'],
            ['name' => 'Agence Ain Sebaa', 'email' => 'ainsebaa@al-andalous.test'],
            ['name' => 'Agence Sidi Othmane', 'email' => 'sidiothmane@al-andalous.test'],
            ['name' => 'Agence Maarif', 'email' => 'maarif@al-andalous.test'],
            ['name' => 'Agence Derb Sultan', 'email' => 'derbsultan@al-andalous.test'],
            ['name' => 'Agence Bourgogne', 'email' => 'bourgogne@al-andalous.test'],
            ['name' => 'Agence Anfa', 'email' => 'anfa@al-andalous.test'],
            ['name' => 'Agence Sidi Maarof', 'email' => 'sidimaarof@al-andalous.test'],
            ['name' => 'Agence oulfa', 'email' => 'oulfa@al-andalous.test'],
            ['name' => 'Agence cil', 'email' => 'cil@al-andalous.test'],
        ];
        foreach ($branches as $branch) {
            User::updateOrCreate(
                ['email' => $branch['email']],
                [
                    'name' => $branch['name'],
                    'password' => Hash::make('20042004'),
                    'role' => 'agent',
                ]
            );
        }
        User::create(
            [
                'email' => 'hamzaabouelwahab04@gmail.com',
                'name' => 'Hamza Admin',
                'password' => Hash::make('20042004'),
                'role' => 'admin',
            ]
        );
    }
}
