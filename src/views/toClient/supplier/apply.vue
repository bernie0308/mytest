<template>
  <div class="container">
    <div class="main-container">
      <div class="form-header">
        <a-typography-title :level="4">元气森林项目供应商入库申请表</a-typography-title>
        <a-typography-paragraph type="secondary" style="text-align: left;margin-bottom: 0px;">
          供应商朋友，您好！请您根据公司实际情况，完成以下数据的录入，以便于我们进行信息审核。感谢您的合作！
        </a-typography-paragraph>
      </div>
      <a-divider style="height: 2px; background-color: #409eff;margin-top: 0;" />
      <div class="form-content">
        <a-spin :spinning="spinning">
          <a-form ref="formRef" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }" autocomplete="off" label-align="left">
            <a-space direction="vertical">
              <div class="module">
                <div class="module-title">
                  <a-typography-title :level="5">公司基础信息</a-typography-title>
                </div>
                <div class="module-content">
                  <a-form-item id="form-companyName" label="公司名称" name="companyName"
                    :rules="[{ required: true, message: '请输入公司名称' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.companyName" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-address" label="公司地址" name="address"
                    :rules="[{ required: true, message: '请输入公司地址' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.address" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-buildTime" label="成立时间" name="buildTime"
                    :rules="[{ required: true, message: '请选择成立时间' }]">
                    <a-date-picker v-model:value="form.buildTime" placeholder="请选择" style="width: 100%"
                      :format="dateFormat" />
                  </a-form-item>
                  <a-form-item id="form-revenueScale" label="营收规模(单位:万)" name="revenueScale"
                    :rules="[{ required: true, message: '请输入公司营收规模信息(近12个月营收规模)', type: 'number' }]">
                    <a-input-number v-model:value="form.revenueScale" style="width: 100%"
                      placeholder="请输入公司营收规模信息(近12个月营收规模)" />
                  </a-form-item>
                  <a-form-item id="form-businessScope" label="业务范围" name="businessScope"
                    :rules="[{ required: true, message: '请输入业务范围' }, { max: 500, message: '超出长度限制' }]">
                    <a-textarea v-model:value="form.businessScope" placeholder="请输入"
                      :auto-size="{ minRows: 2, maxRows: 5 }" />
                  </a-form-item>
                  <a-form-item id="form-description" label="公司简介" name="description"
                    :rules="[{ required: true, message: '请上传公司简介' }, { validator: fileValidator, trigger: 'change' }]">
                    <a-upload v-model:file-list="form.description" name="description" :customRequest="uploadRequest"
                      :before-upload="(file: any, fileList: Array<any>) => beforeUpload(file, fileList, ['doc', 'docx', 'ppt', 'pdf', 'rar', 'zip', 'xls', 'xlsx', 'png', 'jpg', 'bmp'])"
                      :maxCount="1">
                      <a-button v-if="!(form.description[0] && form.description[0].status === 'done')">
                        <upload-outlined></upload-outlined>
                        上传
                      </a-button>
                    </a-upload>
                    <a-typography-text type="secondary">
                      请上传公司简介说明，如历史沿革、组织 架构、经营团队、办公地点、核心业务等。仅支持.doc .docx .ppt .pdf .rar .zip, .xls, .xlsx, .png, .jpg, .bmp格式文件，大小不超过20M。
                    </a-typography-text>
                  </a-form-item>
                </div>
              </div>
              <div class="module">
                <div class="module-title">
                  <a-typography-title :level="5">公司经营资质</a-typography-title>
                </div>
                <div class="module-content">
                  <a-form-item id="form-companyNature" label="企业性质" name="companyNature"
                    :rules="[{ required: true, message: '请选择企业性质' }]">
                    <a-select ref="select" v-model:value="form.companyNature">
                      <a-select-option :value="1">一般纳税企业</a-select-option>
                      <a-select-option :value="2">小规模纳税企业</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item id="form-registeredCapital" label="注册资本(单位:万)" name="registeredCapital"
                    :rules="[{ required: true, message: '请输入注册资本', type: 'number' }]">
                    <a-input-number v-model:value="form.registeredCapital" style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-businessLicense" label="营业执照" name="businessLicense"
                    :rules="[{ required: true, message: '请上传营业执照' }, { validator: fileValidator, trigger: 'change' }]">
                    <a-upload v-model:file-list="form.businessLicense" name="businessLicense"
                      :customRequest="uploadRequest"
                      :before-upload="(file: any, fileList: Array<any>) => beforeUpload(file, fileList, ['jpg', 'jpeg', 'bmp', 'gif', 'png', 'pdf', 'rar', 'zip', 'xls', 'xlsx', 'png', 'jpg', 'bmp'])"
                      :maxCount="1">
                      <a-button v-if="!(form.businessLicense[0] && form.businessLicense[0].status === 'done')">
                        <upload-outlined></upload-outlined>
                        上传
                      </a-button>
                    </a-upload>
                    <a-typography-text type="secondary">
                      仅支持在有效期内的中国大陆工商局或市场监督管理局颁发的工商营业执照（副本复印件）。格式要求：原件照片、扫描件或者复印件加盖企业公章后的扫描件，支持.jpg, .jpeg, .bmp, .gif, .png,
                      .pdf, .rar, .zip, .xls, .xlsx, .png, .jpg, .bmp格式文件，大小不超过5M。
                    </a-typography-text>
                  </a-form-item>
                  <a-form-item id="form-generalTaxpayerCertificate" label="一般纳税人资格证" name="generalTaxpayerCertificate"
                    :required="form.companyNature === 1"
                    :rules="form.companyNature === 1 ? [{ required: true, message: '请上传一般纳税人资格证' }, { validator: fileValidator, trigger: 'change' }] : []">
                    <a-upload v-model:file-list="form.generalTaxpayerCertificate" name="generalTaxpayerCertificate"
                      :customRequest="uploadRequest"
                      :before-upload="(file: any, fileList: Array<any>) => beforeUpload(file, fileList, ['doc', 'docx', 'ppt', 'pdf', 'rar', 'zip', 'xls', 'xlsx', 'png', 'jpg', 'bmp'])"
                      :maxCount="1">
                      <a-button
                        v-if="!(form.generalTaxpayerCertificate[0] && form.generalTaxpayerCertificate[0].status === 'done')">
                        <upload-outlined></upload-outlined>
                        上传
                      </a-button>
                    </a-upload>
                    <a-typography-text type="secondary">
                      仅支持.doc, .docx, .ppt, .pdf, .rar, .zip, .xls, .xlsx, .png, .jpg, .bmp格式文件，大小不超过20M。
                    </a-typography-text>
                  </a-form-item>
                </div>
              </div>
              <div class="module">
                <div class="module-title">
                  <a-typography-title :level="5">公司发票信息</a-typography-title>
                </div>
                <div class="module-content">
                  <a-form-item id="form-invoiceTitle" label="发票抬头" name="invoiceTitle"
                    :rules="[{ required: true, message: '请输入发票抬头' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.invoiceTitle" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-taxNum" label="纳税人识别号" name="taxNum"
                    :rules="[{ required: true, message: '请输入注册资本' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.taxNum" style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-registerAddress" label="注册地址" name="registerAddress"
                    :rules="[{ required: true, message: '请输入注册地址' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.registerAddress" style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-tel" label="电话" name="tel"
                    :rules="[{ required: true, message: '请输入电话' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.tel" style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-bankName" label="开户行" name="bankName"
                    :rules="[{ required: true, message: '请输入银行名称' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.bankName" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-accountNumber" label="账号" name="accountNumber"
                    :rules="[{ required: true, message: '请输入收款账号' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.accountNumber" placeholder="请输入" />
                  </a-form-item>
                </div>
              </div>
              <div class="module">
                <div class="module-title">
                  <a-typography-title :level="5">联系方式</a-typography-title>
                </div>
                <div class="module-content">
                  <a-form-item id="form-contacts" label="联系人" name="contacts"
                    :rules="[{ required: true, message: '请输入联系人' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.contacts" style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                  <a-form-item id="form-phonenum" label="联系电话" name="phonenum"
                    :rules="[{ required: true, message: '请输入联系电话' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.phonenum" placeholder="请输入" auto-size />
                  </a-form-item>
                  <a-form-item id="form-email" label="联系邮箱" name="email"
                    :rules="[{ required: true, message: '请输入联系邮箱' }, { validator: emailValidator, trigger: 'change' }, { max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.email" placeholder="请输入" />
                    <a-typography-text type="secondary">
                      联系邮箱将作为后续信息接收方式，请确保联系邮箱准确！
                    </a-typography-text>
                  </a-form-item>
                </div>
              </div>
              <div class="module">
                <div class="module-title">
                  <a-typography-title :level="5">其他信息</a-typography-title>
                </div>
                <div class="module-content">
                  <a-form-item id="form-paymentDays" label="账期" name="paymentDays"
                    :rules="[{ required: true, message: '请选择账期' }]">
                    <a-select ref="select" v-model:value="form.paymentDays">
                      <a-select-option :value="1">T+90</a-select-option>
                      <a-select-option :value="2">T+60</a-select-option>
                      <a-select-option :value="3">T+30</a-select-option>
                      <a-select-option :value="4">月结</a-select-option>
                      <a-select-option :value="5">预付30%</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item id="form-serviceCase" label="服务案例" name="serviceCase"
                    :rules="[{ required: true, message: '请上传服务案例' }, { validator: fileValidator, trigger: 'change' }]">
                    <a-upload v-model:file-list="form.serviceCase" name="serviceCase" :customRequest="uploadRequest"
                      :before-upload="(file: any, fileList: Array<any>) => beforeUpload(file, fileList, ['doc', 'docx', 'ppt', 'pdf', 'rar', 'zip', 'xls', 'xlsx', 'png', 'jpg', 'bmp'])"
                      :maxCount="1">
                      <a-button v-if="!(form.serviceCase[0] && form.serviceCase[0].status === 'done')">
                        <upload-outlined></upload-outlined>
                        上传
                      </a-button>
                    </a-upload>
                    <a-typography-text type="secondary">
                      仅支持.doc, .docx, .ppt, .pdf, .rar, .zip, .xls, .xlsx, .png, .jpg, .bmp格式文件，大小不超过20M。
                    </a-typography-text>
                  </a-form-item>
                  <a-form-item id="form-scaleCertificate" label="营业规模证明文件" name="scaleCertificate"
                    :rules="[{ validator: fileValidator, trigger: 'change' }]">
                    <a-upload v-model:file-list="form.scaleCertificate" name="scaleCertificate"
                      :customRequest="uploadRequest"
                      :before-upload="(file: any, fileList: Array<any>) => beforeUpload(file, fileList, ['doc', 'docx', 'ppt', 'pdf', 'rar', 'zip', 'xls', 'xlsx', 'png', 'jpg', 'bmp'])"
                      :maxCount="1">
                      <a-button v-if="!(form.scaleCertificate[0] && form.scaleCertificate[0].status === 'done')">
                        <upload-outlined></upload-outlined>
                        上传
                      </a-button>
                    </a-upload>
                    <a-typography-text type="secondary">
                      仅支持.doc, .docx, .ppt, .pdf, .rar, .zip, .xls, .xlsx, .png, .jpg, .bmp格式文件，大小不超过20M。
                    </a-typography-text>
                  </a-form-item>
                  <a-form-item id="form-email" label="推荐人" name="referee" :rules="[{ max: 100, message: '超出长度限制' }]">
                    <a-input v-model:value="form.referee" style="width: 100%" placeholder="请输入推荐人信息（若无推荐人请勿填写该项）" />
                  </a-form-item>
                </div>
              </div>
            </a-space>
            <div class="footer">
              <a-space>
                <a-button type="primary" @click="handleSubmit" :loading="submitLoading">提交</a-button>
              </a-space>
            </div>
          </a-form>
        </a-spin>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { reactive, createVNode, ref, nextTick } from 'vue'
import { submitApplication, applicationDetail, reSubmitApplication } from '@/api/client'
import { uploadFile } from '@/api/base'
import type { UploadFile } from 'ant-design-vue'
import { Modal, message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'
import { Rule } from 'ant-design-vue/lib/form'
const dateFormat = 'YYYY-MM-DD'
interface ApplyForm {
  companyName: string
  contacts: string
  phonenum: string
  email: string
  buildTime: Dayjs
  registeredCapital: number
  revenueScale: number
  companyNature: 1
  businessLicense: Array<UploadFile>
  address: string
  taxNum: string
  bankName: string
  accountNumber: string
  invoiceType: 0
  invoiceTitle: string
  businessScope: string
  description: Array<UploadFile>
  serviceCase: Array<UploadFile>
  generalTaxpayerCertificate: Array<UploadFile>
  paymentDays: string
  referee: string
  registerAddress: string
  tel: string
  scaleCertificate: Array<UploadFile>
}
const formRef = ref()
const form = ref<ApplyForm>({
  companyName: '',
  contacts: '',
  phonenum: '',
  email: '',
  buildTime: dayjs(),
  registeredCapital: NaN,
  revenueScale: NaN,
  companyNature: 1,
  businessLicense: [],
  address: '',
  taxNum: '',
  bankName: '',
  accountNumber: '',
  invoiceType: 0,
  invoiceTitle: '',
  businessScope: '',
  description: [],
  serviceCase: [],
  paymentDays: '',
  referee: '',
  generalTaxpayerCertificate: [],
  registerAddress: '',
  tel: '',
  scaleCertificate: []
})
const route = useRoute()
const spinning = ref(false)
const token = ref('')
if (route.query.token) {
  token.value = String(route.query.token)
}
if (token.value) {
  spinning.value = true
  applicationDetail({
    token: token.value
  }).then((res) => {
    form.value = {
      companyName: res.company_name,
      contacts: res.contacts,
      phonenum: res.phonenum,
      email: res.email,
      buildTime: dayjs(res.build_time),
      registeredCapital: Number(res.registered_capital),
      revenueScale: Number(res.revenue_scale),
      companyNature: res.company_nature,
      businessLicense: res.business_license ? [{
        uid: "business_license",
        name: "营业执照",
        percent: 100,
        status: "done",
        response: {
          cos_url: res.business_license,
          file_name: "营业执照"
        },
        url: res.business_license
      }] : [],
      address: res.address,
      taxNum: res.tax_num,
      bankName: res.bank_name,
      accountNumber: res.account_number,
      invoiceType: res.invoice_type,
      invoiceTitle: res.invoice_title,
      businessScope: res.business_scope,
      description: res.description ? [{
        uid: "description",
        name: "公司介绍",
        percent: 100,
        status: "done",
        response: {
          cos_url: res.description,
          file_name: "公司介绍"
        },
        url: res.business_license
      }] : [],
      serviceCase: res.service_case ? [{
        uid: "service_case",
        name: "服务案例",
        percent: 100,
        status: "done",
        response: {
          cos_url: res.service_case,
          file_name: "服务案例"
        },
        url: res.business_license
      }] : [],
      scaleCertificate: res.scale_certificate ? [{
        uid: "scale_certificate",
        name: "营业规模证明文件",
        percent: 100,
        status: "done",
        response: {
          cos_url: res.scale_certificate,
          file_name: "营业规模证明文件"
        },
        url: res.scale_certificate
      }] : [],
      generalTaxpayerCertificate: res.general_taxpayer_certificate ? [{
        uid: "general_taxpayer_certificate",
        name: "一般纳税人资格证",
        percent: 100,
        status: "done",
        response: {
          cos_url: res.general_taxpayer_certificate,
          file_name: "一般纳税人资格证"
        },
        url: res.general_taxpayer_certificate
      }] : [],
      paymentDays: res.payment_days,
      referee: res.referee,
      registerAddress: res.register_address,
      tel: res.tel
    }
  }).finally(() => {
    spinning.value = false
  })
}
const fileTypeValidate = (fileName: string, accept: Array<string>) => {
  const fileNameSplit = fileName.split('.')
  const suffix = fileNameSplit[fileNameSplit.length - 1]
  return accept.includes(suffix)
}

const beforeUpload = (file: any, fileList: Array<any>, accept: Array<string>) => {
  if (accept && accept.length) {
    const size = file.size
    let valid = true
    if (size / (1024 * 1024 * 20) > 20) {
      message.warning('所选择文件不符合大小')
      valid = false
    }
    valid = fileTypeValidate(file.name, accept)
    if (!valid) {
      message.warning('所选择文件不符合格式')
      file.status = 'error'
    }
    return valid
  }
}

const uploadRequest = (config: any) => {
  console.log('uploadRequest', config)
  const file = config.file
  const formData = new FormData()
  formData.append('file', file)
  uploadFile(formData).then((res: any) => {
    config.onSuccess(res)
    console.log(res)
  }).catch(() => {
    config.onError()
  })
}
const emailValidator = async (rule: Rule, value: string) => {
  var re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  const flag = re.test(value)
  console.log(flag, value, 'value')
  if (!value) {
    return
  }
  if (!flag) {
    return Promise.reject("请检查邮箱格式");
  } else {
    return Promise.resolve();
  }
}
const fileValidator = async (rule: Rule, value: Array<UploadFile>) => {
  console.log(rule, 'rule')
  if (!Array.isArray(value) || !value.length) {
    return
  }
  if (value[0] && value[0].status === 'error' || (value[0].status === 'done' && !value[0].response.cos_url)) {
    return Promise.reject("请上传正确文件")
  } else {
    return Promise.resolve()
  }
}
const router = useRouter()
const submitLoading = ref(false)
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    Modal.confirm({
      title: '确认提交吗',
      icon: createVNode(ExclamationCircleOutlined),
      content: '信息提交后不可修改，请确认信息准确无误后再进行提交！',
      onOk() {
        const sumbitFun = token.value ? reSubmitApplication : submitApplication
        submitLoading.value = true
        sumbitFun({
          company_name: form.value.companyName,
          contacts: form.value.contacts,
          phonenum: form.value.phonenum,
          email: form.value.email,
          build_time: dayjs(form.value.buildTime).format('YYYY-MM-DD'),
          registered_capital: form.value.registeredCapital,
          revenue_scale: form.value.revenueScale,
          company_nature: form.value.companyNature,
          business_license: form.value.businessLicense[0]?.response.cos_url,
          address: form.value.address,
          tax_num: form.value.taxNum,
          bank_name: form.value.bankName,
          account_number: form.value.accountNumber,
          invoice_type: form.value.invoiceType,
          invoice_title: form.value.invoiceTitle,
          business_scope: form.value.businessScope,
          description: form.value.description[0]?.response.cos_url,
          service_case: form.value.serviceCase[0]?.response.cos_url,
          payment_days: form.value.paymentDays,
          referee: form.value.referee,
          general_taxpayer_certificate: form.value.generalTaxpayerCertificate[0]?.response.cos_url,
          register_address: form.value.registerAddress,
          tel: form.value.tel,
          scale_certificate: form.value.scaleCertificate[0]?.response.cos_url,
          token: token.value
        }).then(() => {
          router.push({ name: 'applySuccess' })
        }).finally(() => {
          submitLoading.value = false
        })
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onCancel() { },
    })
  }).catch((error: any) => {
    console.log(error)
    const firstErrorItem = error.errorFields[0]
    const firstErrorName = 'form-' + firstErrorItem.name[0]
    const firstErrorMsg = firstErrorItem.errors[0]
    console.log(firstErrorName, 'boundary')

    const dom = document.getElementById(firstErrorName)
    const htmlEl = document.getElementsByTagName('html')[0]
    if (dom) {
      console.log(dom?.offsetTop)
      htmlEl.scrollTop = dom?.offsetTop - 200
    }
    message.warning(firstErrorMsg)
  })
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #F2F2F2;
  min-height: 100vh;
  padding: 60px 0;

  .main-container {
    max-width: 1200px;
    background-color: #fff;
    margin: 16px auto 0;
    padding: 24px;

    .form-header {
      text-align: center;
    }

    .form-content {
      padding: 0 16px;
    }

    .module {
      .module-title {
        padding: 0px 15px;
        border-left: 5px solid #409eff;
      }

      .module-content {
        padding-left: 16px;
      }
    }
  }

  .footer {
    margin-top: 16px;
  }
}
</style>