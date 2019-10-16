(async () => {
    const logs_channel = server.channels.get(tempVars("logscid")) || msg.channel;
    const text = msg.content.replace(server.tag, '').split(/ +/g);
    text.shift();
    const user = msg.mentions.members.first() || server.members.get(text[0]);
    if (user) {
      delete require.cache[require.resolve('./data/servers')];
      const user2 = user.user.id;
      const autoKick = server.data('auto-kick');
      const autoKickNum = server.data('auto-kicknum');
      const autoBan = server.data('auto-ban');
      const autoBanNum = server.data('auto-bannum');
      const reason = text.join(' ').replace(text[0], "");
      const Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const len = 5;
      const Case = "Case" + Array(len).fill(Chars).map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('');
      const caseReason = reason;
      const caseWarnedBy = msg.author.id;
      const caseUser = user.user.id || user;
      const keys = require('./data/servers')[server.id];
      const Cases = Object.keys(keys).filter((c) => c.includes('Case') && keys[c][0] == user2) || "";
      if (msg.member.hasPermission("KICK_MEMBERS")) {
        if (server.members.get(client.user.id).hasPermission("KICK_MEMBERS")) {
          if (reason.length !== 0) {
            server.setData(Case, [caseUser, caseWarnedBy, caseReason, 'warning'])
            user.send(`You were warned in **${server.name}** for **${reason || 'no reason'}** by **${msg.author.tag}** | **${"Case " + Case.replace("Case", "")}**`)
            const em = new DiscordJS.RichEmbed()
            .setAuthor(`Warned | ${"Case " + Case.replace("Case", "")} | ${client.users.get(user2).tag}`, client.users.get(user2).displayAvatarURL)
            .setColor("#FF0000")
            .addField("User", `${client.users.get(user2).tag} // \n ${client.users.get(user2)}`, true)
            .addField("Moderator", `${msg.author.tag} // \n ${msg.author}`, true)
            .addField("reason", reason || 'None', true)
            .setFooter(`ID: ${client.users.get(user2).id}`)
            .setTimestamp();
          if (Cases.length !== 0) {
            const Cases2 = Cases.map((b) => b.replace('Case', ''))
            em.addField("Other Cases", Cases2.join(" | ") || 'None', true)
          }  
            msg.channel.send(`✅ ***Succesfully warned ${client.users.get(user2).tag}*** | **${"Case " + Case.replace("Case", "")}**`);
            msg.delete();
            logs_channel.send(em);
            console.log(autoKick);
            console.log(autoBan)
          if (autoKick) {
            if (Cases.length === autoKickNum) {
              user.send("You were kicked by the auto kick system for having too much cases!")
              user.kick('Auto Kick')
              em
              .setTitle("Auto Kick")
              .setColor("#FF0000")
              .setDescription(`${user.tag} was kicked for having ${autoKickNum} cases`);
              logs_channel.send(em);
            }
          } else if (autoBan) {
            if (Cases.length === autoBanNum) {
              user.send("You were banned by the auto ban system for having too much cases!")
              server.ban(user, 'Auto Ban')
              em
              .setTitle("Auto Ban")
              .setColor("#FF0000")
              .setDescription(`${user.tag} was banned for having ${autoBanNum} cases`);
              logs_channel.send(em);
            }
          }
          } else {
            msg.channel.send("Please provide a reason for the warning!")
          }
        } else {
          const em = new DiscordJS.RichEmbed()
          .setTitle("No permission")
          .setColor("#FF0000")
          .setDescription("I dont have the required permission **Kick Members**. Please, give me the required permission if you want me to warn people!");
          msg.channel.send(em);
        }
      } else {
        const em = new DiscordJS.RichEmbed()
        .setTitle("No permission")
        .setColor("#FF0000")
        .setDescription("You dont have the required permission **Kick Members**!");
        msg.channel.send(em);
      }
    } else {
      msg.channel.send("I'm sorry, but I can't find this user!")
    }
})

()
