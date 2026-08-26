const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('./config.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
    console.log(`✅ Bot logado como ${client.user.tag}`);
    console.log(`📁 Carregando canais...`);
    
    const canaisPath = path.join(__dirname, 'canais');
    if (fs.existsSync(canaisPath)) {
        const pastas = fs.readdirSync(canaisPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        pastas.forEach(pasta => {
            try {
                const modulo = require(`./canais/${pasta}/index.js`);
                if (typeof modulo === 'function') {
                    modulo(client, config);
                    console.log(`   ✅ Canal "${pasta}" carregado`);
                }
            } catch (err) {
                console.log(`   ❌ Erro ao carregar "${pasta}": ${err.message}`);
            }
        });
    }
    
    console.log(`🎯 Bot pronto!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const comando = args.shift().toLowerCase();
    
    if (comando === 'ping') {
        await message.reply(`🏓 Pong! Latência: ${client.ws.ping}ms`);
    }
    
    if (comando === 'status') {
        await message.reply(`🟢 Bot online! ${client.user.tag}`);
    }
});

client.login('SEU_TOKEN_AQUI');
