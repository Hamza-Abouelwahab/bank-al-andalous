<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
            ['name' => 'Agence Sidi Maarof' , 'email' => 'sidimaarof@al-andalous.test'],
            ['name' => 'Agence oulfa' , 'email' => 'oulfa@al-andalous.test'],
            ['name' => 'Agence cil' , 'email' => 'cil@al-andalous.test'],
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

        User::updateOrCreate(
    ['email' => 'hamzaabouelwahab04@gmail.com'],
    [
        'name' => 'Hamza Admin',
        'password' => Hash::make('20042004'),
        'role' => 'admin',
    ]
);


    }
}
