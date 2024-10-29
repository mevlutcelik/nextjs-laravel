# Next JS + Laravel
Next JS + Laravel Started Kit

## Getting Started
First clone the project to your machine.
```bash
git clone https://github.com/mevlutcelik/nextjs-laravel.git
```
Then let's go into the nextjs folder, create a .env.local file, write the necessary variables in it and install the project requirements.
```bash
cd nextjs && touch .env.local && echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local && npm install
```
Then let's go into the laravel folder and copy the .env.example file as .env, install the project requirements and stand up the database.
```bash
cd .. && cd laravel && cp .env.example .env && composer install && php artisan migrate
```
Then let's start our Laravel (API) project
```bash
php artisan serve
```
Then open a new terminal and start our Next JS project here.
```bash
npm run dev
```
And you're ready 🥳
