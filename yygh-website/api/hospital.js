import request from '@/utils/request'

const api_name = '/api/hosp/hospital'

export default {

    // 分页展示
    pageShow(page, limit, searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },

    // 根据医院名称获取医院列表
    findByHosname(hosname) {
        return request({
            url: `${api_name}/findByHosname/${hosname}`,
            method: 'get',
        })
    },

    show(hoscode) {
        return request({
            url: `${api_name}/${hoscode}`,
            method: 'get'
        })
    },

    // 获取科室列表
    findDept(hoscode) {
        return request({
            url: `${api_name}/department/${hoscode}`,
            method: 'get'
        })
    }
}