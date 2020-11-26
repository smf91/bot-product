const { Telegraf } = require('telegraf')
const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup')
const keyboards = require('./keyboards.js')
const API = require('./api.js')

class SceneGenerator {
    city = []
    GenGetCityListScene() {
        const sceneGetCityList = new Scene('sceneGetCityList')
        sceneGetCityList.enter(async (ctx) => {
            ctx.reply(`Выбери свой город из списка`, await keyboards.ListCityKeyboard())
        })
        sceneGetCityList.on('text', async (ctx) => {
            const cityarr = await API.getCityListAPI()
            if (cityarr.includes(ctx.message.text) === true) {
                // this.state = await keyboards.prepareListProduct(ctx.message.text)
                ctx.scene.enter('sceneGetProductList')
            } else {
                ctx.reply('Используй кнопки внизу экрана')
                ctx.scene.reenter()
            }
        })
        return sceneGetCityList
    }

    GenGetProductListScene() {
        let city = ''
        let state = []
        let idPacking = []
        const sceneGetProductList = new Scene('sceneGetProductList')
        sceneGetProductList.enter(async (ctx) => {
            city = ctx.message.text
            state = await keyboards.prepareListProduct(ctx.message.text)
            await ctx.reply(`Вы в сцене получения списка товаров города ${ctx.message.text}`,
                await keyboards.listProduct(state))
        })
        sceneGetProductList.on('text', async (ctx) => {
            let arrname = state.map((item, iitem) => { return item.name })
            if (arrname.includes(ctx.message.text) === true) {
                await ctx.replyWithPhoto(await keyboards.showProductPhoto(state, ctx.message.text))
                await ctx.reply(keyboards.showProductInfo(state, ctx.message.text),
                    await keyboards.listNameAndPacking(state, ctx.message.text))
            }
            else if (ctx.message.text === 'Выбор города') {
                ctx.scene.enter('sceneGetCityList')
            }
            else {
                ctx.reply('Ты ввел что-то не то, повтори предыдущий шаг')
                ctx.scene.enter('sceneGetCityList')
            }
        })
        sceneGetProductList.on(['message','callback_query'], async (ctx) => {
            if (ctx.update.callback_query != undefined 
                && ctx.update.callback_query.message.text != 'Отличный выбор!') {
                idPacking = ctx.update.callback_query.data
                await ctx.reply('Отличный выбор!',
                                await keyboards.showDistrict(state, idPacking))
            }
            else if (ctx.update.callback_query.message.text === 'Отличный выбор!'){
                ctx.scene.enter('sceneSelectLocation')
            }
            else {
                ctx.scene.enter('sceneGetCityList')
            }
        })
        return sceneGetProductList
    }

    GenLocationScene() {
        const sceneSelectLocation = new Scene('sceneSelectLocation')
        sceneSelectLocation.enter( async (ctx) => {
            await ctx.reply(`Ты выбрал ${ctx.update.callback_query.data}.`);
            ctx.reply('======================')
            // ctx.scene.leave()
        })
        return sceneSelectLocation
    }
}

module.exports = SceneGenerator