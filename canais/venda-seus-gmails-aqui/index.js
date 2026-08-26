const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = (client, config) => {
    console.log('   📌 Configurando canal de vendas...');
    
    client.once('ready', async () => {
        const canal = client.channels.cache.get(config.canalVenda);
        if (!canal) return;
        
        const messages = await canal.messages.fetch({ limit: 10 });
        const botMsg = messages.find(msg => msg.author.id === client.user.id);
        
        if (!botMsg) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('vender_gmail')
                        .setLabel('💰 VENDER GMAIL')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('📧')
                );
            
            await canal.send({
                content: `## 📧 VENDA SEU GMAIL AQUI!\n\n` +
                         `🔽 Clique no botão abaixo para iniciar o processo de venda.\n` +
                         `📌 Você receberá um canal privado para finalizar a transação.`,
                components: [row]
            });
            console.log('   ✅ Mensagem de venda criada');
        }
    });
    
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'vender_gmail') return;
        if (interaction.channel.id !== config.canalVenda) return;
        
        await interaction.reply({
            content: `✅ **Venda iniciada!** Aguarde que um atendente vai te chamar em breve.\n` +
                     `📌 Enquanto isso, prepare: **Gmail, senha e chave Pix**.`,
            ephemeral: true
        });
        
        console.log(`   💰 ${interaction.user.tag} clicou em VENDER GMAIL`);
    });
    
    console.log('   ✅ Canal de vendas configurado');
};
