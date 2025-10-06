# Bot-pplg2 🤖

Simple Discord Bot for manage classroom funds, check individual contributions, and more.

---

## Features ✨

- Check total funds: `!kas total` 💰
- Check individual contribution status: `!kas {name}` 📊
- Check individual contribution history: `!kas history {name}` 📜
- List all commands: `!help` 🆘
- More features will be added as this project grows 🚀

---

## Tech Stack 🛠️

- **Node.js** - Runtime environment 🌐
- **Discord.js** - Library to interact with Discord API 💬
- **MySQL** - Database 🗄️
- **dotenv** - Manage environment variables 🔑 

---

## Setup ⚙️

1. Clone the repository:
```bash
git clone https://github.com/fiqqar/bot-pplg2.git
cd your-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root with your Discord bot token and command prefix:
```
DISCORD_TOKEN=your_discord_bot_token
PREFIX=!
```

4. Folder Structure:
```
/commands   -> all command files 📂
/db.js      -> database connection 🗄️
/index.js   -> main bot entry point 🚀
.env        -> environment variables (not pushed) 🔑
```

5. Run the bot:
```bash
node index.js
```

---

## Contributing 🤝

If you want contribute on making new commands, follow these steps:

1. **Fork** the repository to your own GitHub account.
2. Clone your fork and start editing. Example command file format:
```js
module.exports = {
    name: 'command_name',
    description: 'command_description',
    async execute(message, args, db, client) {
        // command logic
    }
};
```
3. After you finish making changes, create a new branch (e.g., `add-new-command`) and push it into your fork :
```bash
git checkout -b command/new-command
git add .
git commit -m "command [your-name] new command 'your-command'"
git push origin command/new-command
```
6. Open a **Pull Request (PR)** from your fork to the main repository 📤
7. Wait for me to review your pull request and either accept or reject it ✅❌

---

## License 📜

MIT License

Fiqar yaping
