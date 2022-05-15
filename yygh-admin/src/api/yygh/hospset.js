import request from '@/utils/request'

const api_name = '/admin/hosp/hospitalSet'

export default {
    // 分页带条件查询医院设置
    pageInfo(page, limit, searchObj) {
        return request({
            url: `${api_name}/pageInfo/${page}/${limit}`,
            method: 'post',
            data: searchObj // 使用 json 方式传参
        })
    },

    // 根据id删除医院设置
    delHospSet(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },

    // 添加医院设置
    addHospSet(hospitalSet) {
        return request({
            url: `${api_name}/addHospSet`,
            method: 'post',
            data: hospitalSet
        })
    },

    // 根据id查询医院设置
    getHospSetById(id) {
        return request({
            url: `${api_name}/getHospSetById/${id}`,
            method: 'get'
        })
    },

    // 修改医院设置
    updateHospSet(hospitalSet) {
        return request({
            url: `${api_name}/updateHospSet`,
            method: 'post',
            data: hospitalSet
        })
    },

    // 批量删除
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    },

    // 医院状态设置
    lockHospitalSet(id, status) {
        return request({
            url: `${api_name}/lockHospitalSet/${id}/${status}`,
            method: 'put'
        })
    }
}