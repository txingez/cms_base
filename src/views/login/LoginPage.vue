<template>
    <div class="content-center bg-right flex justify-center items-center h-screen bg-[url(https://lh3.googleusercontent.com/pw/AIL4fc-J6iD2OQld4PuJ_DMf6xByK2bI5ZDAV_oSSbT0QiAn9CBkJWuKrBWq2-41lwevfHYtxgLJhCkctLwnYTjCWbabmvijw7bUojXD5Wa7bDnIXwpwgF9wgo_T7ED5xuDPyI1l2RfOlBoTeKCs8TLru8I=w1873-h970-s-no?authuser=0)]">
        <div
                class="xl:w-2/5 lg:w-3/5 sm:w-4/5 w-11/12 bg-white p-8 opacity-90 lg:opacity-100 rounded shadow-gray-400 shadow-md">
            <a-form :model="formState" :validate-messages="validateMessages" autocomplete="off" layout="vertical"
                    name="basic" @finish="handleSubmit">
                <div class="text-3xl font-semibold my-5">Đăng nhập</div>
                <a-form-item :rules="[{ pattern: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), message: 'Email không dúng định dạng' },
                { required: true, message: 'Hãy nhập thông tin' }]" label="Email" name="email">
                    <a-input v-model:value="formState.email" placeholder="Email"/>
                </a-form-item>

                <a-form-item :rules="[{ required: true, message: 'Bạn chưa nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải ít nhất 6 kí tự' }]" label="Mật khẩu" name="password">
                    <a-input-password v-model:value="formState.password" placeholder="Mật khẩu"/>
                </a-form-item>

                <div class="flex justify-end">
                    <a-form-item>
                        <a-button :loading="state.loading" class="bg-[#1677ff]" html-type="submit" type="primary">
                            Đăng nhập
                        </a-button>
                    </a-form-item>
                </div>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import {reactive} from "@vue/reactivity";
import {useRouter} from "vue-router";
import {login} from "../../services/authentication";
import {ModalError} from "../../components/ModalError";
import {ModalSuccess} from "../../components/ModalSuccess";

const router = useRouter();

const state = reactive({
    loading: false
});

const formState = reactive({
    email: "",
    password: "",
    type: "CMS"
});

const validateMessages = {
    required: "${label} không được để trống!",
};

const handleSubmit = () => {
    state.loading = true

    const body = {
        email: formState.email,
        password: formState.password,
        type: formState.type
    }

    login(body)
        .then((response) => {
            state.loading = false
            const user = response.data.data.user
            const callback = () => {
                localStorage.setItem(import.meta.env.ENV_USER_ID_KEY, user.id)
                localStorage.setItem(import.meta.env.ENV_EMAIL_KEY, user.email)
                localStorage.setItem(import.meta.env.ENV_FULL_NAME_KEY, `${user.first_name} ${user.last_name}`)
                localStorage.setItem(import.meta.env.ENV_TOKEN_KEY, user.token)
                router.push("/");
            }
            ModalSuccess('Bạn đã đăng nhập thành công', callback)
        }).catch((err) => {
        console.log(err)
        state.loading = false
        const data = err.response.data
        const message = data.message
        ModalError('Đăng nhập thất bại', handleLoginFailed(message))
    })
};

const handleLoginFailed = message => {
    switch (message) {
        case 'Access denied!!!':
            return 'Bạn không có quyền truy cập trang web này!'
        case 'Please fill in all fields!':
            return 'Hãy điền đầy đủ thông tin đăng nhập!'
        case 'Password does not match.':
            return 'Mật khẩu không đúng'
        case 'The provided email is not registered.':
            return 'Email chưa được đăng ký!'
        default:
            return 'Có lỗi xảy ra. Vui lòng kỹ thuật để hỗ trợ!'
    }
}
</script>
