<template>
  <div class="home-container">
    <div class="title">
      <h4>Genki Forest Referral Program</h4>
      <a-button @click="handleEdit">编辑</a-button>
    </div>
    <a-modal v-model:visible="visible" title="Edit Referral Program" :bodyStyle="{ maxHeight: '600px', overflow: 'auto' }" @ok="handleOk">
      <a-form
        :model="formState"
        name="basic"
        labelAlign="left"
        layout="vertical"
        autocomplete="off"
      >
        <h4>Friend reward</h4>
        <a-form-item
          label="Reward Type"
          name="rewardType"
        >
           <a-select v-model:value="formState.friendRewardType" :options="friendOptions"></a-select>
        </a-form-item>

        <a-form-item
          label="Amount"
          name="amount"
        >
          <a-input-number id="inputNumber" v-model:value="formState.friendRewardValue" :min="0" :max="maxFriendAmount" />
        </a-form-item>

        <a-form-item
          label="Expiry in days"
          name="expiry"
        >
          <a-input-number id="inputNumber" v-model:value="formState.friendRewardExpiryInDays" :min="0" :max="999" />
        </a-form-item>

        <h4>Referrer reward</h4>
        <a-form-item
          label="Reward Type"
          name="rewardType"
        >
           <a-select v-model:value="formState.referrerRewardType" :options="referrerOptions"></a-select>
        </a-form-item>

        <a-form-item
          label="Amount"
          name="amount"
        >
          <a-input-number id="inputNumber" v-model:value="formState.referrerRewardValue" :min="0" :max="maxReferrerAmount" />
        </a-form-item>

        <a-form-item
          label="Expiry in days"
          name="expiry"
        >
          <a-input-number id="inputNumber" v-model:value="formState.referrerRewardExpiryInDays" :min="0" :max="999" />
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="content">
      <a-form
        ref="formDateRef"
        :model="formDate"
        name="basic"
        labelAlign="left"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label="日期选择"
          name="date"
          :rules="[{ required: true, message: '请先选择日期！' }]"
        >
          <a-range-picker v-model:value="date" />
        </a-form-item>
      </a-form>
      <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">Export Referrers</a-menu-item>
          <a-menu-item key="2">Export Friends</a-menu-item>
          <a-menu-item key="3">Export Orders</a-menu-item>
        </a-menu>
      </template>
      <a-button class="more-btn">
        More
        <DownOutlined />
      </a-button>
    </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from "vue"
import type { Dayjs } from 'dayjs';
type RangeValue = [Dayjs, Dayjs];
import { DownOutlined, RedditSquareFilled } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
import { exportreFerrals, exportreFriends, exportreOrders, editMerchant, getMerchant } from '@/api/statistics'
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import {useStore} from "vuex"
interface FormState {
  friendRewardType: string;
  friendRewardValue: string;
  friendRewardExpiryInDays: number;
  referrerRewardType: string;
  referrerRewardValue: string;
  referrerRewardExpiryInDays: number;
}
export default defineComponent({
  components: {
    DownOutlined,
  },
  setup() {
    const w = window as any
    let {state} = useStore();
    let store = computed(() => state.user.store)
    const visible = ref<boolean>(false)
    const formState = reactive<FormState>({
      friendRewardType: 'Percentage',
      friendRewardValue: '10',
      friendRewardExpiryInDays: 10,
      referrerRewardType: 'Percentage',
      referrerRewardValue: '10',
      referrerRewardExpiryInDays: 10
    });
    const formDateRef = ref<FormInstance>();
    const date = ref<RangeValue>()
    const formDate = reactive({
      date
    })
    const friendOptions = [
      { label: 'Percentage', value: 'Percentage' },
      { label: 'Fixed amount', value: 'Fixed amount' },
    ];
    const referrerOptions = [
      { label: 'Percentage', value: 'Percentage' },
      { label: 'Fixed amount', value: 'Fixed amount' },
    ];
    const refData = reactive({
      arr: []
    })
    // let checkNum = async (_rule: Rule, value: number) => {
    //   const num = /^[0-9]*$/
    //   if (!num.test(value)) {
        
    //   }
    // };
    const maxFriendAmount = computed({
      set: (val) => {
        maxFriendAmount.value = val
      },
      get: () => {
        if (formState.friendRewardType === 'Percentage') {
          return 100
        } else {
          return 999
        }
      }
    })
    const maxReferrerAmount = computed({
      set: (val) => {
        maxFriendAmount.value = val
      },
      get: () => {
        if (formState.referrerRewardType === 'Percentage') {
          return 100
        } else {
          return 999
        }
      }
    })
    const handleEdit = () => {
      handleGetMerchant().then(() => {
        visible.value = true
      }).finally(() => {
        visible.value = true
      })
      
    }
    const dateFormat = 'YYYY/MM/DD';
    const handleOk = () => {
      visible.value = false
      const { friendRewardType, friendRewardValue, friendRewardExpiryInDays, referrerRewardType, referrerRewardValue, referrerRewardExpiryInDays} = formState
      const friend = Object.assign({}, { rewardType: friendRewardType }, { rewardValue: friendRewardValue.toString() }, { rewardExpiryInDays: friendRewardExpiryInDays})
      const referrer = Object.assign({}, { rewardType: referrerRewardType }, { rewardValue: referrerRewardValue.toString() }, { rewardExpiryInDays: referrerRewardExpiryInDays})
      handleEditMerchant('us', { friend, referrer})
    }
    const handleMenuClick: MenuProps['onClick'] = async e => {
      const valid = await formDateRef.value.validateFields()
      if (valid) {
        refData.arr = []
        date.value.map((i:any) => {
          refData.arr.push(i.$d.toLocaleDateString())
        })
        switch (e.key) {
          case '1':
            handleExportreFerrals()
            break;
          case '2':
            handleExportFriends()
            break;
          default:
            handleExportOrders()
            break;
        }
      }  
    };
    // 导出referrals信息
    const handleExportreFerrals = () => {
      exportreFerrals(store.value, { date: refData.arr })
    }
    // 导出friend信息
    const handleExportFriends = () => {
      exportreFriends(store.value, { date: refData.arr })
    }
    // 导出orders信息
    const handleExportOrders = () => {
      exportreOrders(store.value, { date: refData.arr })
    }
    // 编辑推荐人配置
    const handleEditMerchant = (store:string, data:Record<string, any> = {}) => {
      editMerchant(store, data).then((res:any) => {
        w.$message.success('编辑成功！')
      })
    }
    // 回显推荐人配置
    const handleGetMerchant = () => {
      return getMerchant('us').then((res:any) => {
        const settings = res.reward_settings
        formState.friendRewardType = settings.friend.rewardType
        formState.friendRewardValue = settings.friend.rewardValue
        formState.friendRewardExpiryInDays = settings.friend.rewardExpiryInDays
        formState.referrerRewardType = settings.referrer.rewardType
        formState.referrerRewardValue = settings.referrer.rewardValue
        formState.referrerRewardExpiryInDays = settings.referrer.rewardExpiryInDays
      })
    }
    return {
      visible,
      formState,
      referrerOptions,
      friendOptions,
      date,
      refData,
      formDate,
      formDateRef,
      dateFormat,
      maxFriendAmount,
      maxReferrerAmount,
      handleEdit,
      handleOk,
      handleMenuClick,
      handleEditMerchant,
      handleExportreFerrals,
      handleExportFriends,
      handleExportOrders,
      handleGetMerchant
    }
  }
})
</script>
<style lang="scss" scoped>
.title {
  padding: 20px;
  border-radius: 4px;
  box-shadow: var(--p-card-shadow,0 0 0 1px rgba(63,63,68,.05),0 1px 3px 0 rgba(63,63,68,.15));
  h4 {
    font-weight: 600;
    font-size: 14px;
  }
}
.content {
  margin-top: 20px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: var(--p-card-shadow,0 0 0 1px rgba(63,63,68,.05),0 1px 3px 0 rgba(63,63,68,.15));
}
::v-deep .ant-input-number {
  width: 100%;
}
</style>