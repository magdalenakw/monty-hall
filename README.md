# Problem Monty'ego Halla

Interaktywna symulacja problemu Monty'ego Halla zbudowana w React + Vite.

## Co robi aplikacja

- Pozwala zagrać ręcznie i sprawdzić, czy zmiana wyboru się opłaca
- Zbiera statystyki wygranych przy strategii "zostań" vs "zmień"
- Umożliwia autoplay — symulację tysięcy partii jednym kliknięciem
- Pokazuje historię rozgrywek z paginacją

## Stack

| Warstwa      | Technologia       | Wersja |
| ------------ | ----------------- | ------ |
| Framework UI | React             | 19.2.0 |
| Język        | TypeScript        | —      |
| Build tool   | Vite              | 7.3.1  |
| Ikony        | FontAwesome (SVG) | 7.2.0  |
| Stylowanie   | CSS (Neumorphism) | —      |
| Formatowanie | Prettier          | 3.8.1  |
| Linting      | ESLint v9         | 9.39.1 |

## Testy

Testy jednostkowe napisane w Vitest + Testing Library pokrywają logikę hooka `useMontyHall` oraz czyste funkcje pomocnicze.

```
npm test
```

## Uruchomienie

```
npm install
npm run dev
```
