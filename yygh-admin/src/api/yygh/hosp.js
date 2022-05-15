import request from '@/utils/request'

const api_name = '/admin/hosp/hospital'

export default {

    // 带条件带分页查询医院
    hospPageInfo(page, limit, searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    // 更新医院状态
    updateStatus(id, status) {
        return request({
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    },
    // 查看医院详情
    getHospById(id) {
        return request({
            url: `${api_name}/show/${id}`,
            method: 'get'
        })
    },

}