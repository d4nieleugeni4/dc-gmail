module.exports = (client, config) => {
    console.log('   📌 Configurando canal de boas-vindas...');
    
    client.on('guildMemberAdd', async (member) => {
        const canal = member.guild.channels.cache.get(config.canalBoasVindas);
        if (!canal) return;
        
        const cargo = member.guild.roles.cache.get(config.cargoMembro);
        if (cargo) {
            try {
                await member.roles.add(cargo);
                console.log(`   👤 ${member.user.tag} recebeu cargo Membro`);
            } catch (err) {
                console.log(`   ❌ Erro ao dar cargo: ${err.message}`);
            }
        }
        
        await canal.send({
            content: `🎉 **Bem-vindo(a) ao servidor, ${member.user}!** 🎉\n\n` +
                     `📖 Leia as <#${config.canalInstrucoes}> para entender como funciona.\n` +
                     `💵 Se quiser vender seus Gmails, acesse <#${config.canalVenda}>.`
        });
    });
    
    console.log('   ✅ Canal de boas-vindas configurado');
};
