
import service from './http'

export const _post = (url, data) => {
    return service({
        url,
        method: 'post',
        data
    })
}
