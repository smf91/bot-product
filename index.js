require('dotenv').config()
const { Telegraf } = require('telegraf')
const { Extra, Markup, Stage, session } = Telegraf
const bot = new Telegraf(process.env.BOT_TOKEN)
const SceneGenerator = require('./Scenes')
const CurrentScene = new SceneGenerator()
const getCityListScene = CurrentScene.GenGetCityListScene()
const sceneSelectLocation = CurrentScene.GenLocationScene()
const sceneGetProductList = CurrentScene.GenGetProductListScene()
// connect keyboards
// const {Catch} = require('telegraf/composer')
const keyboards = require('./keyboards')


const stage = new Stage([getCityListScene, sceneSelectLocation, sceneGetProductList])
bot.use(session())
bot.use(stage.middleware())

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    })

bot.start(async (ctx) =>{
    try{
        ctx.reply(`Дорогой покупатель, Добро пожаловать в Жаркие Тропики!`,
        await Markup.inlineKeyboard([{ text: 'К покупкам!', callback_data: 'shoping' }]).resize().extra()
    )
    }
    catch (e) {
        console.error(e)}
})

bot.action('shoping', (ctx) => { ctx.scene.enter('sceneGetCityList') })



bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
