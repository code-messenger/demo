import request from '@/utils/request'

const api_name = '/admin/cmn/dict'

export default {

    // 根据id查询子数据列表
    findChildDateByParentId(id) {
        return request({
            url: `${api_name}/findChildData/${id}`,
            method: 'get',
        })
    },

    // 根据字典编码查询子数据列表
    findChildDateByDictCode(dictCode) {
        return request({
            url: `${api_name}/findByDictCode/${dictCode}`,
            method: 'get',
        })
    },
}