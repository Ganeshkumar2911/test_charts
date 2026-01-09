<template>
    <div class="d-flex justify-center align-center" style="height: 100vh;"> 
        <v-row class="h-75 mx-2 mx-md-16 rounded-xl elevation-2" style="background-color: #f5e3fc;">
            <v-col cols="12" md="6" class="d-none d-md-flex justify-center align-center">
                <v-img src="@/assets/loginImg.svg" height="70%" width="80%"></v-img>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-center align-center">
                <v-card width="100%" max-width="440" elevation="4" class="rounded-xl">
                    <!-- Login View -->
                        <div class="pa-6 pb-4">
                            <v-card-title class="text-h5 text-center font-weight-bold px-0">
                                Welcome Back
                            </v-card-title>
                            <v-card-subtitle class="text-center px-0 mt-1">
                                Login in to continue to your account
                            </v-card-subtitle>
                        </div>
                        <v-card-text class="px-6 pb-4">
                            <v-form ref="login_form" @submit.prevent>
                                <div>
                                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                        Email Address
                                    </label>
                                    <v-text-field
                                        v-model="email"
                                        variant="outlined"
                                        placeholder="Enter your 10-digit mobile number"
                                        :disabled="disable"
                                        density="comfortable"
                                        prepend-inner-icon="mdi-email-outline"
                                    >
                                    </v-text-field>
                                </div>
                                <div>
                                    <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
                                        Password
                                    </label>
                                    <v-text-field
                                        v-model="password"
                                        maxlength="10"
                                        variant="outlined"
                                        placeholder="Enter your password"
                                        :disabled="disable"
                                        density="comfortable"
                                        prepend-inner-icon="mdi-lock-outline"
                                        type="tel"
                                    >
                                    </v-text-field>
                                </div>
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="px-6 pb-6 pt-2 mb-4">
                            <v-btn
                                @click="login"
                                color="primary"
                                variant="flat"
                                size="large"
                                block
                                class="text-none font-weight-medium"
                                elevation="0"
                            >
                                <v-icon start>mdi-check-circle</v-icon>
                                Verify & Login
                            </v-btn>
                        </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
    </template>
<script setup>
import { ref } from 'vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const email = ref('');
const password = ref('');
const disable = ref(false);

const login = () => {
    disable.value = true;
    const data = {
        email: email.value,
        password: password.value
    }
    const successHandler = (response) => {
        disable.value = false;
        sessionStorage.setItem("token", `Bearer ${response.access_token}`);
        proxy.$router.push("/dashboard");
    }
    const failureHandler = (error) => {
        disable.value = false;
        proxy.$toast.error("Login failed. Please check your credentials.");
    }
    proxy.$api.request_POST(
        "/auth/login",
        data,
        successHandler,
        failureHandler
    );
}

</script>
    