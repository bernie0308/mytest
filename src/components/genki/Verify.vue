<template>
    <a-modal v-model:visible="visible"  @cancle="handleCancle">
        <a-form
          ref="formRef"
          :model="formState"
          labelAlign="left"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
        >
            <a-form-item
                label="审核结果"
                name="result"
                :rules="[{ required: true, message: '请选择审核结果' }]"
            >
                <a-radio-group v-model:value="formState.result" :options="resultOptions" />
            </a-form-item>
            <div class="notice">
                <p>{{ noticeTitle }}</p>
                <p>{{ noticeContent }}</p>
            </div>
            <a-form-item
                v-if="formState.result === 3"
                label="入库来源"
                name="put_type"
                :rules="[{ required: formState.result === 3, message: '请选择入库来源' }]"
            >
                <a-radio-group v-model:value="formState.put_type" :options="typeOptions"></a-radio-group>
            </a-form-item>
            <a-form-item
                v-if="formState.result === 3 && formState.put_type === 1"
                label="推荐人"
                name="referee"
                :rules="[{ required: formState.result === 3 && formState.put_type === 1, message: '请输入推荐人信息' }]"
            >
                <a-input v-model:value="formState.referee" placeholder="请输入推荐人信息" />
            </a-form-item>
            <a-form-item
                v-if="formState.result === 3"
                label="入库级别"
                name="level"
                :rules="[{ required: formState.result === 3, message: '请选择入库级别' }]"
            >
                <a-select v-model:value="formState.level" :options="options" placeholder="请选择入库级别"></a-select>
            </a-form-item>
            <a-form-item
                v-if="formState.result === 3"
                label="业务类型"
                name="business_type_ids"
                :rules="[{ required: formState.result === 3, message: '请选择业务类型' }]"
            >
                <a-tree-select
                    v-model:value="formState.business_type_ids"
                    placeholder="请选择业务类型"
                    tree-checkable
                    multiple
                    treeCheckStrictly
                    showCheckedStrategy
                    allow-clear
                    :field-names="fieldNames"
                    :tree-data="refData.treeData"
                    @select="handleSelect"
                />
            </a-form-item>
            <a-form-item
                label="审核备注"
                name="approval_remark"
                :rules="[{ required: true, message: '请填写备注信息' }]"
            >
                <a-textarea v-model:value="formState.approval_remark" placeholder="请填写备注信息"></a-textarea>
            </a-form-item>
            <div v-if="formState.result !== 3" class="info">
                备注信息将随邮件一同发送至供应商
            </div>
        </a-form>
        <template #title>
            <div class="modal-header">
                <span class="modal-title">审核</span>
                <a-popover title="审核说明">
                    <template #content>
                        <p>
                            <span class="status">通过：</span>
                            <span>通过后供应商状态将变为审核通过，并将发送审核通过通知邮件至对应供应商</span>
                        </p>
                        <p>
                            <span class="status">驳回：</span>
                            <span>驳回后供应商状态将变为待重新修改，并将发送修改资料邮件至对应供应商，供应商修改资料后可重新发起申请</span>
                        </p>
                        <p>
                            <span class="status">不通过：</span>
                            <span>不通过后供应商状态将变为不通过，并将发送审核不通过邮件至对应供应商</span>
                        </p>
                    </template>
                    <question-circle-outlined />
                </a-popover>
            </div>
        </template>
        <template #footer>
            <a-button key="back" @click="handleCancle">取消</a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import type { FormInstance, SelectProps, RadioGroupProps, TreeSelectProps } from 'ant-design-vue';
import { getBusinessList } from '@/api/config';

interface FormState {
    result: Number,
    put_type: Number,
    referee: String,
    level:Number,
    business_type_ids:Array<number>,
    approval_remark: String
}
export default defineComponent({
    emits: ['submit', 'cancle'],
    props: {
        showModal: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    setup(props, ctx) {
        const refData = reactive({
            treeData: [],
        })
        const fieldNames: TreeSelectProps['fieldNames'] = {
            children: 'children',
            label: 'name',
            value: 'id'
        };
        const formRef = ref<FormInstance>();
        const options = ref<SelectProps['options']>([
            {
                value: 1,
                label: '中标入围(一级)',
            },
            {
                value: 2,
                label: '参与招标(二级)',
            },
            {
                value: 3,
                label: '参与招标(二级)'
            },
            {
                value: 4,
                label: '参与招标(二级)',
            },
            {
                value: 5,
                label: '参与招标(二级)',
            }
        ]);
        const loading: Ref<boolean> = ref(false)
        const formState = reactive<FormState>({
            result: 3,
            put_type: props.data.put_type,
            referee: props.data.referee,
            level: null,
            business_type_ids: [],
            approval_remark: ''
        });
        const handleSelect = () => {
            console.log(formState.business_type_ids)
        }
        const resultOptions = [
            { label: '通过', value: 3 },
            { label: '不通过', value: 2 },
            { label: '驳回', value: 1 },
        ];
        const typeOptions = [
            { label: '投递', value: 2 },
            { label: '推荐', value: 1 },
            { label: '收集', value: 3 },
        ];
        const handleCancle = () => {
            ctx.emit('cancle')
        }
        const handleOk = async () => {
            loading.value = true
            const valid = await formRef.value.validateFields()
            if (valid) {
                if (formState.result !== 3) {
                    delete(formState.put_type)
                    delete(formState.referee)
                    delete(formState.level)
                    delete(formState.business_type_ids)
                }
                const form = Object.assign({}, formState, { business_type_ids: [] })
                formState.business_type_ids.map((i:any) => {
                    form.business_type_ids.push(i.value)
                })
                ctx.emit('submit', form)
            }
        }
        const getTableData = ()  => {
            getBusinessList().then((res:any) => {
                refData.treeData = res
            })
        }
        getTableData()
        const noticeTitle = ref<String>('请问您确认要通过该供应商审核吗？')
        const noticeContent = ref<String>('审核通过后，供应商将接收到审核通过通知邮件。')
        watch(() => formState.result, (value:number) => {
            switch (value) {
                case 1:
                    noticeTitle.value = '请问您确认要驳回该供应商申请吗？'
                    noticeContent.value = '驳回供应商申请后，供应商将收到修改资料邮件，供应商修改资料后可重新发起申请'
                    break;
                case 2:
                    noticeTitle.value = '请问您确认要不通过该供应商审核吗？'
                    noticeContent.value = '不通过审核后，供应商将接收到审核不通过通知邮件。'
                    break;
                default:
                    noticeTitle.value = '请问您确认要通过该供应商审核吗？'
                    noticeContent.value = '审核通过后，供应商将接收到审核通过通知邮件。'
                    break;
            }
        })
        const visible = computed({
            set: () => {
                ctx.emit('cancle')
            },
            get: () => {
                return props.showModal
            }
        })
        return {
            visible,
            loading,
            handleOk,
            handleCancle,
            formState,
            options,
            resultOptions,
            handleSelect,
            typeOptions,
            refData,
            fieldNames,
            formRef,
            noticeTitle,
            noticeContent
        }
    }
})
</script>
<style lang="scss" scoped>
.notice {
    p:last-child {
        color: #A6AAB7;
    }
}
.modal-header {
    .modal-title {
        display: inline-block;
        width: 90%;
    }
    .status {
        font-weight: 600
    }
}
.info {
    color: #A6AAB7;
}
</style>