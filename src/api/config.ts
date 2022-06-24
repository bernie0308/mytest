import request from '@/utils/request'

// 获取业务类型管理列表
export function getBusinessList() {
    return request({
      url: '/business-type/list',
      method: 'get'
    })
}

// 新建业务类型
export function addBusinessType(data: unknown) {
    return  request({
        url:'/business-type/add-type',
        method: 'post',
        data
    })
}

// 编辑业务类型
export function editBusinessType(data: unknown) {
    return  request({
        url:'/business-type/edit-type',
        method: 'post',
        data
    })
}

// 删除业务类型
export function delBusinessType(data: unknown) {
    return  request({
        url:'/business-type/del-type',
        method: 'post',
        data
    })
}

// 获取媒体类型全部列表(无分页)
export function getMediaAllList(params:unknown) {
    return request({
        url: '/media-type/selector',
        method: 'get',
        params
    })
}

// 获取媒体类型列表
export function getMediaList(params:unknown) {
    return request({
        url: '/media-type/list',
        method: 'get',
        params
    })
}

// 新建媒体类型
export function addMediaType(data:Record<string, unknown> = {}) {
    return request({
        url: '/media-type/add-type',
        method: 'post',
        data
    })
}

// 编辑媒体类型
export function editMediaType(data:Record<string, unknown> = {}) {
    return request({
        url: '/media-type/edit-type',
        method: 'post',
        data
    })
}

// 删除媒体类型
export function delMediaType(data:Record<string, unknown> = {}) {
    return request({
        url: '/media-type/del-type',
        method: 'post',
        data
    })
}