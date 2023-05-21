const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("hello")
            .setDescription("Répond avec Bonjour!")
            .addStringOption(option =>
                option.setName("firstname")
                    .setDescription("Please provide first name")
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("language")
                    .setDescription("The desired language")
                    .setRequired(true)
                    .addChoices(
                        { name: "English", value: "en" },
                        { name: "French", value: "fr" },
                        { name: "German", value: "de" },
                    )
            ),
    async execute(interaction){
        const firstname = interaction.options.getString("firstname");
        const language = interaction.options.getString("language");

        let text = "";

        switch(language){
            case "en":
                text = "Hello " + firstname;
                break;
            case "fr":
                text = "Bonjour " + firstname;
                break;
            case "de":
                text = "Guten Tag " + firstname;
                break;

            default:
                text = "Hello " + firstname;
        }

        await interaction.reply(text);
    }
}