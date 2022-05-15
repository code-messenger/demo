import request from '@/utils/request'

const api_name = '/admin/hosp/department'

export default {

    // 查看医院科室信息
    getDeptByHospcode(hoscode) {
        return request({
            url: `${api_name}/getDeptList/${hoscode}`,
            method: 'get'
        })
    },
}