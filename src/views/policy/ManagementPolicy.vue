<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>
  <div class="bg-white min-h-[85vh]">
    <a-button class="m-5"
              danger
              @click="confirmRemoveUser"
              :disabled="usersToRemove.length === 0">
      Loại bỏ
    </a-button>
    <a-tree class="p-3"
            :showLine="{showLeafIcon: false}"
            :selectable="false"
            :tree-data="treeData">
      <template #switcherIcon="{ switcherCls, dataRef }">
        <down-outlined :class="switcherCls"/>
      </template>
      <template #title="{ dataRef }">

        <template v-if="dataRef.key.includes('sub_child')">
          <a-checkbox @change="handleCheck(dataRef)">
            <span class="text-sky-500">{{ dataRef.title }}</span>
          </a-checkbox>
        </template>

        <template v-else-if="parNotHaveSubMenu.includes(dataRef.key)">
          <div class="space-x-1.5">
            <span class="font-medium">{{ dataRef.title }}</span>
            <span class="cursor-default font-normal"
                  v-if="dataRef.children && dataRef.children.length">
              ({{ dataRef.children.length }})
            </span>
            <span
                :class="`${checkPermission(dataRef) ? 'cursor-not-allowed text-gray-300': 'cursor-pointer text-sky-500'}`"
                @click.prevent="showAddModal(dataRef)">
              <plus-outlined/>
            </span>
          </div>
        </template>

        <template v-else-if="dataRef.key === 'par_2'">
          <span class="font-medium">{{ dataRef.title }}</span>
        </template>

        <template v-else>
          <div class="space-x-1.5 flex">
            <span class="font-medium">{{ dataRef.title }}</span>
            <span class="cursor-default font-normal"
                  v-if="dataRef.children && dataRef.children.length">
              ({{ dataRef.children.length }})
            </span>
            <span
                :class="`${checkPermission(dataRef) ? 'cursor-not-allowed text-gray-300': 'cursor-pointer text-sky-500'}`"
                @click.prevent="showAddModal(dataRef)">
              <plus-outlined/>
            </span>
          </div>
        </template>

      </template>
    </a-tree>
  </div>

  <a-modal v-model:visible="visibleAddModal" @cancel="handleCancel">
    <template #title>
      <span>Chia sẻ '{{ policyNameClicked }}'</span>
    </template>
    <template #footer>
      <div>
        <a-button @click="handleCancel">Huỷ</a-button>
        <a-button type="primary"
                  @click="handleSubmitAddUser">
          Xác nhận
        </a-button>
      </div>
    </template>
    <div class="space-y-2.5">
      <div>Thêm người vào nhóm {{ policyNameClicked }}</div>
      <a-select v-model:value="usersToAdd"
                mode="multiple"
                label-in-value
                placeholder="Nhập email người dùng"
                class="w-full"
                :filter-option="false"
                :not-found-content="fetchingUser ? undefined : null"
                :options="dataUser"
                @search="searchUser">
        <template v-if="fetchingUser" #notFoundContent>
          <a-spin size="small"/>
        </template>
      </a-select>
    </div>
  </a-modal>
</template>

<script setup>
import {DownOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons-vue"
import {createVNode, onMounted, ref} from "vue";
import {getAllPolicies, updateUserInPolicy} from "../../services/policy";
import {handleResponse} from "../../services/commonService";
import {ACCESS_TOKEN_KEY, MAP_KEY_TREE_WITH_NAME} from "../../constants/constants";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import {Modal} from "ant-design-vue";
import {debounce} from "lodash-es";
import {getUsers} from "../../services/user";
import {decodeJWT} from "../../utils/decodeJWT";
import {showToast} from "../../utils/showToast";
import axios from "axios";

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý phân quyền', to: '/policy'}
];

const parNotHaveSubMenu = ['par_0', 'par_1', 'par_3', 'par_4']

const usersToRemove = ref([]);
const policiesOfUser = ref([]);
const policyInfo = ref(new Map());
const visibleAddModal = ref(false);
const policyNameClicked = ref('');
const policyIdClicked = ref('');
const usersToAdd = ref([]);
const fetchingUser = ref(false);
const dataUser = ref([]);

const treeData = ref([
      {title: 'Quản lý phân quyền', key: 'par_0', children: []},
      {title: 'Quản lý chuyên mục', key: 'par_1', children: []},
      {
        title: 'Quản lý tin tức', key: 'par_2', children: [
          {title: 'Soạn thảo tin tức', key: 'child_2_0', children: []},
          {title: 'Phê duyệt tin tức', key: 'child_2_1', children: []},
          {title: 'Duyệt đăng tin', key: 'child_2_2', children: []}
        ]
      },
      {title: 'Quản lý bình luận', key: 'par_3', children: []},
      {title: 'Quản lý banner và popup', key: 'par_4', children: []}
    ]
);

onMounted(() => {
  const decodedInfoUser = decodeJWT(sessionStorage.getItem(ACCESS_TOKEN_KEY));
  const policiesInfo = JSON.parse(decodedInfoUser.policies).map(p => p.name);
  policiesOfUser.value = policiesInfo;

  getPolicies();
});

const checkPermission = (dataRef) => {
  return !policiesOfUser.value.includes('PUBLIC_NEWS') && dataRef.key !== 'child_2_0'
};

const getPolicies = () => {
  getAllPolicies()
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          const treeDataCurrent = Object.assign([], treeData.value);
          const policyIdMap = new Map(responseData.data.map(p => [p.name, p._id]));
          const policiesUserMap = new Map(responseData.data.map(p => [p.name, p.users]));

          policyInfo.value = policyIdMap;
          treeData.value = treeDataCurrent.map(td => {
            switch (td.key) {
              case 'par_2':
                return {
                  ...td, children: td.children.map(childData => {
                    const namePolicy = MAP_KEY_TREE_WITH_NAME[childData.key]
                    const policies = policiesUserMap.get(namePolicy)
                    return namePolicy && policies
                        ? {
                          ...childData, children: policies.map((pd, index) => {
                            return {key: `sub_${childData.key}_${index}_${pd._id}`, title: pd.email}
                          })
                        }
                        : childData
                  })
                };

              default:
                const namePolicy = MAP_KEY_TREE_WITH_NAME[td.key]
                const policies = policiesUserMap.get(namePolicy)
                return namePolicy && policies
                    ? {
                      ...td, children: policies.map((pd, index) => {
                        return {key: `sub_child_${td.key}_${index}_${pd._id}`, title: pd.email}
                      })
                    }
                    : td
            }
          })
        }
      })
      .catch(error => {
        console.log('Lấy danh sách quyền bị lỗi, ', error);
        showToast('error', 'Lấy danh sách phân quyền thất bại');
      });
};

const handleCheck = (data) => {
  const indexData = usersToRemove.value.indexOf(data.key);
  indexData !== -1 ? usersToRemove.value.splice(indexData, 1) : usersToRemove.value.push(data.key);
};

const showAddModal = (dataRef) => {
  if (!checkPermission(dataRef)) {
    policyNameClicked.value = dataRef.title;
    policyIdClicked.value = policyInfo.value.get(MAP_KEY_TREE_WITH_NAME[dataRef.key]);
    visibleAddModal.value = true;
  }
};

const handleCancel = () => {
  policyNameClicked.value = '';
  policyIdClicked.value = '';
  usersToAdd.value = [];
  visibleAddModal.value = false;
};

const handleSubmitAddUser = () => {
  const body = {
    type: 'ADD',
    users: usersToAdd.value.map(u => u.value)
  }

  updateUserInPolicy(policyIdClicked.value, body)
      .then(response => {
        const responseUpdate = handleResponse(response.status, response.data);
        if (responseUpdate) {
          getPolicies();
          handleCancel();
        }
      })
      .catch(error => {
        console.log('Lỗi khi thêm người', error);
        showToast('error', 'Thêm user thất bại');
      });
};

const searchUser = debounce(value => {
  fetchingUser.value = true;
  getUsers(1, 1000, `&filters[search]=${value}`)
      .then(response => {
        fetchingUser.value = false;
        const responseData = handleResponse(response.status, response.data);
        if (responseData) {
          dataUser.value = responseData.data.docs.map(u => {
            return {
              label: u.fullName,
              value: u._id
            }
          })
        }
      });
}, 500);

const confirmRemoveUser = () => {
  Modal.confirm({
    title: 'Xác nhận',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Bạn có chắc chắn muốn xóa quyền sử dụng chức năng của người dùng không?',
    okText: 'Xác nhận',
    okType: 'danger',
    cancelText: 'Huỷ',
    onOk() {
      deleteUserPolicy();
    },
    onCancel() {
      console.log('Cancel remove policy of user');
    }
  });
};

const deleteUserPolicy = async () => {
  const selectedUserToRemove = Object.keys(MAP_KEY_TREE_WITH_NAME).map(k => {
    const selectedByPolicyName = usersToRemove.value.filter(e => e.includes(k))
    if (selectedByPolicyName.length !== 0) {
      return {policyId: policyInfo.value.get(MAP_KEY_TREE_WITH_NAME[k]), user: selectedByPolicyName};
    }
  }).filter(e => e !== undefined);

  const requests = selectedUserToRemove.map(userAndPId => {
    const body = {
      type: 'DELETE',
      users: userAndPId.user.map(u => u.slice(u.lastIndexOf('_') + 1))
    };
    return updateUserInPolicy(userAndPId.policyId, body)
  })
  axios.all(requests)
      .then(responses => {
        const responseData = responses.map(r => handleResponse(r.status, r.data))
        const isSuccessAll = responseData.every(r => r !== null)
        if (isSuccessAll) {
          usersToRemove.value = [];
          getPolicies();
        }
      })
      .catch(error => {
        console.log('Xoá quyền của user bị lỗi, ', error);
        showToast('error', 'Xoá quyền của user thất bại')
      })
};
</script>
