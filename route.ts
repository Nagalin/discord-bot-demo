import { Router } from 'express'
import { Client, GatewayIntentBits, ChannelType } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()
const router = Router()
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
    ]
})

client.login(process.env.DISCORD_BOT_TOKEN)
client.once('ready', () => console.log('Discord bot is ready'))

router.post('/direct-message', async (req, res) => {
    const USER_ID = 'YOUR_USER_ID'

    try {
        const user = await client.users.fetch(USER_ID)
        await user.send('Hello! This is an automatic DM from the bot.')
        res.send(`DM sent to user with ID: ${USER_ID}`)
    } catch (error) {
        console.error('Error fetching user or sending DM: ', error)
    }
})

router.post('/private-channel', async (req, res) => {
    const USER_ID = 'YOUR_USER_ID'
    const CHANNEL_ID = 'YOUR_USER_CHANNEL_ID'

    try {
        const channel = await client.channels.fetch(CHANNEL_ID)
        if (!channel || channel.type !== ChannelType.GuildText) {
            console.error('Channel not found or is not a text channel.')
            return
        }

        const guild = channel.guild
        const member = await guild.members.fetch(USER_ID)
        if (!member) {
            console.error('User not found.')
            return
        }

        await channel.permissionOverwrites.create(member, {
            ViewChannel: true,
            SendMessages: true,
        })

        console.log(`Successfully invited <@${USER_ID}> to the channel!`)
    } catch (error) {
        console.error('An error occurred while trying to invite the user:', error)
    } finally {
        res.send('User added to private channel')

    }
})

export default router