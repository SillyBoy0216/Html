const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const BOT_TOKEN = 'MTMxMzU3NTI4NjEzNDAxMzk5NA.GyTKcF._t3WqYPaSS7TDN1IAJ84f6K67y5YpJrCPyBvFU';
const VOUCHES_FILE = 'vouches.json'; // File to store vouches
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Ensure vouches file exists
if (!fs.existsSync(VOUCHES_FILE)) {
    fs.writeFileSync(VOUCHES_FILE, JSON.stringify([]));
}

client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Command to add a vouch
    if (message.content.startsWith('?vouch')) {
        const args = message.content.slice(6).trim();
        if (!args) {
            return message.reply('❌ Please provide a valid vouch message. Example: `?vouch ⭐⭐⭐⭐⭐ {your message}`');
        }

        // Add the vouch
        const vouch = {
            username: message.author.username,
            avatar: message.author.displayAvatarURL({ format: 'png', dynamic: true }),
            stars: args.split(' ')[0],
            message: args.split(' ').slice(1).join(' '),
        };

        const vouches = JSON.parse(fs.readFileSync(VOUCHES_FILE, 'utf8'));
        vouches.push(vouch);
        fs.writeFileSync(VOUCHES_FILE, JSON.stringify(vouches, null, 2));

        message.reply('✅ Your vouch has been added!');
    }

    // Command to list all vouches
    if (message.content.startsWith('?listvouches')) {
        const vouches = JSON.parse(fs.readFileSync(VOUCHES_FILE, 'utf8'));

        if (vouches.length === 0) {
            return message.reply('❌ No vouches have been added yet.');
        }

        const vouchList = vouches
            .map(
                (v, index) =>
                    `**#${index + 1}**\n⭐ ${v.stars}\n💬 ${v.message}\n👤 ${v.username}\n`
            )
            .join('\n\n');

        message.channel.send(`📜 **Vouches:**\n\n${vouchList}`);
    }
});

client.login(BOT_TOKEN);
