const { REST, Routes } = require("discord.js");
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = require("./config");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
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
            commands.push(command.data.toJSON());
        }else{
            console.log("L'un des deux attributs au moins est manquant");
        }
    }
}

// On initialise le module REST
const rest = new REST().setToken(BOT_TOKEN);

// On déploie les commandes
(async () => {
    try{
        console.log(`Début de rafraichissement des ${commands.length} commandes`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log(`Fin de rafraichissement des ${data.length} commandes`);
    }catch(error){
        console.error(error);
    }
})();