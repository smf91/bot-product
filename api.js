const axios = require ('axios')

exports.getCityListAPI = async () =>{
    try {
        const response = await axios.get('http://localhost:3000/api/city')
        return response.data.city
    } catch (e) {
        console.error(e)
        return 'error getCityListAPI'
    }
}

exports.getProductListAPI = async (city) =>{
    try {
        const response = await axios.get(`http://localhost:3000/api/${city}`)
        return response.data.data
    } catch (e) {
        console.error(e)
        return 'error getProductListAPI '
    }
}
