<template>
    <div class="content-center bg-right flex justify-center items-center h-screen bg-blue-500">
        <div
                class="xl:w-2/5 lg:w-3/5 sm:w-4/5 w-11/12 bg-white p-8 opacity-90 lg:opacity-100 rounded shadow-gray-400 shadow-md"
        >
            <a-form :model="formState"
                    layout="vertical"
                    name="basic"
                    autocomplete="off"
                    :validate-messages="validateMessages"
                    @finish="handleSubmit">
                <div class="text-3xl font-semibold my-5">Đăng nhập</div>
                <a-form-item label="Tên đăng nhập"
                             name="username"
                             :rules="[{ required: true }]">
                    <a-input v-model:value="formState.username"
                             placeholder="Tên đăng nhập"/>
                </a-form-item>

                <a-form-item label="Mật khẩu"
                             name="password"
                             :rules="[{ required: true }]">
                    <a-input-password v-model:value="formState.password"
                                      placeholder="Mật khẩu"/>
                </a-form-item>

                <div class="flex justify-end">
                    <a-form-item>
                        <a-button type="primary" html-type="submit" :loading="state.loading">
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
import {ACCESS_TOKEN_KEY} from "@/constants/constants";
import {handleResponse} from "../../services/commonService";
import {showToast} from "../../utils/showToast";

const router = useRouter();

const state = reactive({
    loading: false
});

const formState = reactive({
    username: "",
    password: ""
});

const validateMessages = {
    required: "${label} không được để trống!",
};

const handleSubmit = () => {
    state.loading = true;

    const body = {
        username: formState.username,
        password: formState.password
    };

    login(body)
        .then(responseLogin => {
            const responseLoginData = handleResponse(responseLogin.status, responseLogin.data);
            state.loading = false;
            if (responseLoginData) {
                storeInfoLogin(responseLoginData.data.accessToken, responseLoginData.data.refreshToken);
                router.push("/");
            }
        })
        .catch(error => {
            //For test, delete when done backend api
            storeInfoLogin('accessToken');
            router.push("/");

            //Todo: Uncomment code when auth api has done
            // state.loading = false;
            // console.log('Lỗi đăng nhập', error);
            // showToast('error', 'Đăng nhập thất bại')
        })
};

const storeInfoLogin = (accessToken) => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};
</script>
