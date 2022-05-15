import request from '@/utils/request'


const api_name = '/admin/hosp/schedule'

export default {

    // 查看医院科室信息
    getScheduleRule(page, limit, hoscode, depcode) {
        return request({
            url: `${api_name}/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`,
            method: 'get'
        })
    },

    // 查询排班详情
    getScheduleDetail(hoscode, depcode, workDate) {
        return request({
            url: `${api_name}/getScheduleDetail/${hoscode}/${depcode}/${workDate}`,
            method: 'get'
        })
    }
}