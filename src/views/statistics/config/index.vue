<template>
    <!-- cross sell配置 -->
    <div>cross sell配置</div>

    <!-- 新增按钮 -->
    <div class="box_add">
        <a-button class="add_color" @click="add">新增</a-button>
    </div>

    <!-- tab 表格 -->
    <div class="box_tab">
        <a-table class="tab" :columns="crossData" :data-source="getProductListX" bordered>
            <template #headerCell="{ column }">
                <template v-if="column.key === 'title'">
                    <span>
                        <image src="@/assets/logo.jpg" mode="scaleToFill" />
                    </span>
                </template>
            </template>

            <template #bodyCell="{ column, record }">
                <!-- 产品名称 -->
                <template v-if="column.key === 'name'">
                    <a>
                        {{ record.title }}
                    </a>
                </template>

                <!-- 产品图片 -->
                <template v-else-if="column.key === 'image'">
                    <img class="image_width" :src="record.image" mode="scaleToFill" />
                    <!-- <a>
                        {{ record.image }}
                    </a> -->
                </template>

                <!-- 是否生效 -->
                <!-- <template v-else-if="column.key === 'is_active'">
                    <a>
                        {{ record.is_active === true ? "生效" : "失效" }}
                    </a>
                </template> -->

                <!-- 折扣类型 -->
                <template v-else-if="column.key === 'discount_type'">
                    <a>
                        {{ record.discount_type }}
                    </a>
                </template>
                <template v-else-if="column.key === 'action'" slot-scope="{ row }">
                    <span>
                        <a> {{ record.name }}</a>
                        <!-- <a-divider type="vertical" /> -->
                        <a @click="emitCommodityName(record)">编辑</a>
                        <a-divider type="vertical" />
                        <a class="ant-dropdown-link" @click="out(record.id)"> 删除 </a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>

    <!-- 失效的弹出框 -->
    <div>
        <a-modal v-model:visible="isShowOut" title="温馨提示" @ok="delProduct">
            <p>是否删除该商品?</p>
        </a-modal>
    </div>

    <!-- 编辑的弹出框 -->
    <div>
        <a-modal v-model:visible="isShowEmit" title="温馨提示" :footer="null" @cancel="cancel">
            <!-- 编辑弹出框里面的表单 -->
            <div class="box_form">
                <a-form
                    :model="emitCommodityList"
                    name="basic"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <!-- 产品名称 -->
                    <a-form-item label="产品名称">
                        <a-input v-model:value="emitCommodityList.title" />
                    </a-form-item>

                    <!-- ShopifyX产品ID -->
                    <a-form-item label="产品ID">
                        <a-input v-model:value="emitCommodityList.product_id" />
                    </a-form-item>

                    <!-- 折扣类型 -->
                    <a-form-item label="折扣类型">
                        <a-input v-model:value="emitCommodityList.product_id" />
                    </a-form-item>

                    <!-- 素材名 -->
                    <a-form-item
                        label="西部大嫖客"
                        name="password"
                        :rules="[{ required: true, message: '请输入密码' }]"
                    >
                        <a-input v-model:value="emitFormData.password" />
                    </a-form-item>

                    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                        <a-button style="margin-left: 10px" @click="cancelOut">取消</a-button>
                        <a-button type="primary" html-type="submit">确定</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>

    <!-- 新增的弹出层 -->
    <div>
        <a-modal
            v-model:visible="isShowAdd"
            width="1000px"
            title="温馨提示"
            @cancel="cancel"
            @ok="addSubmit"
        >
            <!-- 编辑弹出框里面的表单 -->
            <div class="box_select">
                <a-form
                    :model="addFormData"
                    name="basic"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <!-- 产品X -->
                    <a-form-item name="area" label="产品X">
                        <a-select
                            v-model:value="addFormData.product_id"
                            :field-names="{ label: 'title', value: 'id' }"
                            :options="productDataX"
                            @change="changeOptions"
                        />
                    </a-form-item>

                    <!-- 折扣类型 -->
                    <a-form-item name="area" label="折扣类型">
                        <a-select v-model:value="addFormData.discount_type" :options="valueData" />
                    </a-form-item>

                    <div v-for="(i, index) in addFormData.y_products" :key="i" class="box_price">
                        <!-- Y 产品1 -->
                        <a-form-item name="area" :label="`产品Y ${index + 1}`">
                            <a-select
                                class="price_list"
                                v-model:value="i.y_product_id"
                                :field-names="{ label: 'title', value: 'id' }"
                                :options="productDataX"
                                @change="changeOptions"
                            />
                        </a-form-item>

                        <a-form-item name="area">
                            <!-- 折扣 -->
                            <span class="discount">折扣: </span>
                            <a-input class="box_inp" v-model:value="i.discount_value" />
                        </a-form-item>
                        <span class="box_but">
                            <a-space>
                                <a-button shape="circle" @click="shoppingAdd"> + </a-button>
                                <a-button
                                    :disabled="index === 0"
                                    shape="circle"
                                    @click="shoppingReduce(index)"
                                >
                                    -
                                </a-button>
                            </a-space>
                        </span>
                    </div>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue"
import type { SelectProps } from "ant-design-vue"
import {
    // 管理端-CrossSell折扣产品列表
    getProductList,
    // 管理端-Shopify产品列表 (头部新增的按钮 )
    getProductAddList,
    // 管理端-设置X产品折扣商品 (新增的接口)
    getProductAddDiscountX,
    // 删除接口
    ProductDelDisableProductX,
} from "@/api/statistics"
import { ref, reactive, defineComponent, nextTick, watch } from "vue" // 弹出框
import { AxiosResponse } from "axios"

interface FormState {
    product_id: number | null
    discount_type: string
    is_active: boolean
    y_products: Array<Object>
}
export default defineComponent({
    name: "statistics",
    setup() {
        // 删除的弹出框
        const isShowOut = ref(false)
        // 编辑的弹出框
        const isShowEmit = ref(false)
        // 新增的弹出层
        const isShowAdd = ref(false)
        // 编辑的弹出框的 ref
        const myFormRefs = ref("")
        const tabData = ref([])
        // 产品 X 数据
        const productDataX = ref<array>([])
        // 新增添加按钮的数据
        const getProductListX = ref([])
        // 测试
        const tagId = ref([])
        // 删除的数据
        const x_product_id = ref<number>(0)
        // 编辑的产品名称
        const emitCommodityList = ref({})
        // 新增 弹出框里面的表单
        const addFormData = reactive<FormState>({
            product_id: null,
            discount_type: "percentage",
            is_active: true,
            y_products: [
                {
                    y_product_id: 1,
                    discount_value: "20",
                },
            ],
        })
        // 编辑 弹出框里面的表单
        const emitFormData = ref([])

        // 产品 Y 的id
        const changeOptions = () => {
            const arr = addFormData.y_products.map((item) => item.y_product_id)
            arr.push(addFormData.product_id)
            productDataX.value.forEach((element: { id: number; disabled: boolean }) => {
                if (arr.includes(element.id)) {
                    element.disabled = true
                } else {
                    element.disabled = false
                }
            })
        }

        // 拿到 新增按钮 数据源
        const getProductAdd = () => {
            getProductAddList("umys").then((res: AxiosResponse<any>) => {
                productDataX.value = res
                // productDataX.value = res.value.title
                console.log(productDataX.value, "addFormData-----")
            })
        }
        getProductAdd()

        // 新增按钮的 添加数据
        const getProductData = () => {
            getProductList("umys").then((res: AxiosResponse<any>) => {
                getProductListX.value = res
                // console.log(getProductListX.value, "-----")
            })
        }
        getProductData()

        // 调用删除的接口
        const ProductDel = () => {
            ProductDelDisableProductX("umys", { cs_x_product_id: x_product_id.value }).then(
                (res: AxiosResponse<any>) => {
                    console.log(res, "-----")
                }
            )
        }

        // 删除的确定按钮
        const delProduct = () => {
            isShowOut.value = false
            // 调用删除接口
            ProductDel()
            // 重新获取最新的数据
            getProductData()
            console.log(123)
        }

        // 头部的新增按钮
        const add = () => {
            isShowAdd.value = true
        }

        // 新增按钮的提交
        const addSubmit = () => {
            getProductAddDiscountX("umys", addFormData)
                .then((res) => {
                    isShowAdd.value = false
                    getProductData()
                })
                .finally(() => {
                    loading.value = false
                })
        }

        // for 循环商品++
        const shoppingAdd = () => {
            addFormData.y_products.push({
                y_product_id: 0,
                discount_value: "20",
            })
            changeOptions()
        }

        // for 循环商品--
        const shoppingReduce = (index: number) => {
            addFormData.y_products.splice(index, 1)
            changeOptions()
        }

        // --------------------
        // 编辑按钮里面的表单 校验成功
        const onFinish = (values: any) => {
            console.log("Success:", values)
            isShowEmit.value = false
        }

        // 编辑按钮里面的表单 校验失败
        const onFinishFailed = (errorInfo: any) => {
            console.log("Failed:", errorInfo)
        }
        // ---------------

        // 删除弹窗的确定按钮
        const OutSubmit = () => {
            isShowOut.value = false
        }

        // 删除按钮弹出框
        const out = (productId: Number) => {
            x_product_id.value = productId
            console.log(x_product_id.value, "888888888888888888888888")

            isShowOut.value = true
        }

        // 编辑按钮弹出框
        const emitCommodityName = (record: object) => {
            emitCommodityList.value = record
            console.log(emitCommodityList.value, "record--record--record--record")
            isShowEmit.value = true
        }

        // 编辑表单的取消按钮
        const cancelOut = () => {
            isShowEmit.value = false
            myFormRefs.value.resetFields()
        }

        // 编辑表单的右上角的 x
        const cancel = () => {
            myFormRefs.value.resetFields()
        }

        // option 数据
        const valueData = reactive([
            {
                value: "percentage",
                label: "percentage",
            },
            {
                value: "fixed_amount",
                label: "fixed_amount",
            },
        ])

        const crossData = [
            {
                title: "产品名称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "产品图片",
                dataIndex: "image",
                key: "image",
            },
            {
                title: " ShopifyX产品ID",
                dataIndex: "product_id",
                key: "product_id",
            },
            // {
            //     title: "是否生效",
            //     key: "is_active",
            //     dataIndex: "is_active",
            // },
            {
                title: "折扣类型",
                key: "discount_type",
                dataIndex: "discount_type",
            },

            {
                title: "操作",
                key: "action",
            },
        ]

        // const tabData = [
        //     {
        //         key: "1",
        //         name: "胡歌",
        //         age: 18,
        //         address: "中国",
        //         variantId: "variant_id",
        //     },
        //     {
        //         key: "2",
        //         name: "易烊千玺",
        //         age: 18,
        //         address: "中国",
        //         skuid: 23,
        //     },
        //     {
        //         key: "3",
        //         name: "谢老师",
        //         age: 18,
        //         address: "中国",
        //         skuid: 23,
        //     },
        // ]
        return {
            crossData,
            tabData,
            isShowOut,
            isShowEmit,
            addFormData,
            emitFormData,
            myFormRefs,
            isShowAdd,
            productDataX,
            changeOptions,
            addSubmit,
            getProductListX,
            ProductDel,
            delProduct,
            x_product_id,
            emitCommodityName,
            emitCommodityList,
            shoppingReduce,
            shoppingAdd,
            add,
            cancel,
            cancelOut,
            out,
            OutSubmit,
            onFinish,
            onFinishFailed,
            valueData,
            // 下面三个是下拉框的
            size: ref<SelectProps["size"]>("middle"),
            value1: ref("a1"),
            tagId,
        }
    },
})
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.box_add {
    margin-right: 50px;
    text-align: right;
    .add_color {
        color: #fff;
        background-color: #1c93ff;
    }
}
.box_tab {
    margin: 20px 30px;
    // 图片宽高
    .image_width {
        width: 40px;
        height: 40px;
    }
}
.box_form {
    button.ant-btn {
        margin-left: 10px;
    }
}
.box_select {
    // position: relative;
    // input 框
    .box_price {
        position: relative;
        height: 55px;

        // 加、减 按钮
        .box_but {
            position: absolute;
            width: 200px;
            top: 5px;
            right: 85px;
            width: 20px;
            height: 20px;
            display: flex;
            margin-right: 0;
            // 加加
            .box_add {
                width: 20px;
                height: 20px;
                padding-left: 3.5px;
                line-height: 10px;
                border-radius: 50%;
            }
            // 减减
            .box_reduce {
                width: 20px;
                height: 20px;
                margin-left: 5px;
                line-height: 10px;
                border-radius: 50%;
                margin-left: -35px;
            }
        }
        .box_inp {
            position: absolute;
            width: 280px;
            top: -57px;
            right: -196px;
        }
        // 折扣
        .discount {
            position: absolute;
            width: 150px;
            top: -52px;
            right: -25px;
        }
        // 下拉框的数据
        .price_list {
            width: 260px;
        }
    }
}
</style>
