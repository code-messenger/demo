import request from '@/utils/request'

const api_name = '/api/user'

export default {
    // 用户登录
    login(userInfo) {
        return request({
            url: `${api_name}/login`,
            method: 'post',
            data: userInfo
        })
    }
}