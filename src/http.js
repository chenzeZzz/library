import axios from 'axios'

const service = axios.create({
    baseURL: 'http://barryli.ink:9999', // api的base_url
    timeout: 5000 // 请求超时时间
})

service.interceptors.response.use(
    response => { // 成功请求到数据
        console.log('response===', response)
        return Promise.resolve(response)
    },
    error => { // 响应错误处理
        console.log('error====haahah', error)
        console.log(JSON.stringify(error))

        return Promise.reject(error)
    }
)

export default service
