const Markup = require('telegraf/markup')
const API = require('./api.js')


const cityArr = [
    { name: "Москва", path: 'Moscow' },
    { name: "Волгоград", path: 'Volgograd' }
]

exports.ListCityKeyboard = async () => {
    let buttonArr = []
    let listCityArr = await API.getCityListAPI()
    listCityArr.map((city, icity) => {
        buttonArr.push([{ text: city, callback_data: 'city' }])

    })
    return Markup.keyboard(buttonArr).resize().extra()
}

exports.prepareListProduct = async (city) => {
    let cityPath = ''
    cityArr.find((elem, index) => {
        if (elem.name === city) {
            cityPath = elem.path
        }
    })
    return await API.getProductListAPI(cityPath)
}

exports.listProduct = (productArr) => {
    let buttonArr = [[{ text: 'Выбор города', callback_data: 'selectLocation' }]]
    productArr.map((product, iproduct) => {
        buttonArr.push([{ text: product.name, callback_data: product._id }])
    })
    return Markup.keyboard(buttonArr).resize().extra()
}

exports.listNameAndPacking = async (productArr, productName) => {
    let buttonArr = []
    let arr = await productArr.filter((product, iproduct) => {
        return product.name === productName
    })
    await arr[0].packing.map((pac, ipac) => {
        buttonArr.push([{
            text: `${pac.price} руб - ${pac.amt}г.`, callback_data: `${pac._id}`
        }])
    })
    return Markup.inlineKeyboard(buttonArr).resize().extra()
}

exports.showProductPhoto = (productArr, productName) => {
    let arr = productArr.filter((product, iproduct) => {
        return product.name === productName
    })
    return { source: arr[0].img }
}

exports.showProductInfo = (productArr, productName) => {
    let buttonArr = []
    let arr = productArr.filter((product, iproduct) => {
        return product.name === productName
    })
    return `Вы выбрали: ${arr[0].name}. ${arr[0].tagline}`
}

exports.showDistrict = (state, id) => {
    let buttonArr = []
    let price =''
    let location =[]
    state.forEach((product => {
        product.packing.forEach((pac, ipac) => {
            if (pac._id === id) {
                price = pac.price
                location.push(...pac.location)
            }
        })
    }))
    location.map((district, idistrict) => {
        buttonArr.push([{ 
                text: district, 
                callback_data: `${district}. Цена ${price}`
            }])
    })
    return Markup.inlineKeyboard(buttonArr).resize().extra()
}