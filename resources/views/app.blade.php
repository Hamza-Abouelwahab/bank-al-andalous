<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect theme preference and apply it immediately --}}
    <script>
        (function() {
            const getStoredAppearance = () => {
                try {
                    return window.localStorage.getItem('appearance');
                } catch {
                    return null;
                }
            };

            const storedAppearance = getStoredAppearance();
            const appearance = storedAppearance || '{{ $appearance ?? 'system' }}';
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

            document.documentElement.classList.toggle('dark', isDark);
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=5">
    <link rel="shortcut icon" type="image/svg+xml" href="/favicon.svg?v=5">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />
</body>

</html>
