// On instancie DiscordJS
const { Client, Collection, Events, GatewayIntentBits, Partials } = require("discord.js");
const { BOT_TOKEN } = require("./config");
const path = require("node:path");
const fs = require("node:fs")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.GuildMember
    ]
});

client.commands = new Collection();
// On crée le chemin du dossier commands
const foldersPath = path.join(__dirname, "commands");
// On récupère les dossiers dans commands
const commandFolders = fs.readdirSync(foldersPath);

// On boucle sur chaque dossier
for(const folder of commandFolders){
    // On crée le chemin vers 1 dossier
    const commandsPath = path.join(foldersPath, folder);
    // On récupère les fichiers JS du dossier
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    
    // On boucle sur les fichiers
    for(const file of commandFiles){
        // On crée le chemin du fichier
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // On vérifie si on a data ET execute dans le fichier
        if("data" in command && "execute" in command){
            client.commands.set(command.data.name, command);
        }else{
            console.log("L'un des deux attributs au moins est manquant");
        }
    }
}

// On attend que le bot soit prêt
client.on("ready", () => {
    // On change le statut
    client.user.setPresence({
            activities: [{
                name: 'faire une démo'
            }],
            status: 'dnd'
        });
        
    
})

// On gère l'exécution des commandes
client.on(Events.InteractionCreate, async interaction => {
    // Si on n'est pas sur une commande /, on ne fait rien
    if(!interaction.isChatInputCommand()) return;

    // On récupère la commande
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`Pas de commande correspondant à ${interaction.commandName}`);
    }

    try{
        //On essaie d'exécuter l'interaction
        await command.execute(interaction);
    }catch(error){
        console.log(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({ content: "Une erreur est survenue en exécutant cette commande", ephemeral: true});
        }else{
            await interaction.reply({ content: "Une erreur est survenue en exécutant cette commande", ephemeral: true});
        }
    }
});


// On se connecte
client.login(BOT_TOKEN);