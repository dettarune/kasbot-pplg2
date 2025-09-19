require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const db = require('./db');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX;

client.baseEmbed = function (message) {
    return new EmbedBuilder()
        .setFooter({
            text: `Requested by: ${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();
};

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
        console.log(`[COMMAND] Loaded: ${command.name}`);
    } else {
        console.warn(`[WARNING] File ${file} is not a valid file`);
    }
}

client.on('ready', () => {
    console.log(`${client.user.tag} online`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) {
        return message.reply(`Belum bikin command **${message.content.split(' ')[0]}**. Coba cek **!help** untuk daftar command yang ada.`);
    };

    try {
        await command.execute(message, args, db, client);
    } catch (error) {
        console.error(error);
        message.reply('Error while running command.');
    }
});

client.login(token);
