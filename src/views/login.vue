<template>
    <div class="login-container">
        <div class="title white">图书馆控制台</div>
        <div class="main">
            <el-form :model="user"
                :rules="rules"
                ref="loginForm">
                <el-form-item prop="name">
                    <el-input v-model="user.name"
                        placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input v-model="user.pwd"
                        type="password"
                        placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                        plain
                        style="width: 100%;"
                        @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { api } from '@/config'
import Store from 'store2'

export default {
    name: 'login',
    data() {
        return {
            user: {
                name: 'admin',
                pwd: '666666'
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        }
    },
    methods: {
        login() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.http.post(api.loginApi, {
                        username: this.user.name,
                        password: this.user.pwd
                    }).then(res => {
                        if (res.status === 200) {
                            Store.set('user', res.data)
                            Store.set('isLogin', 1)
                            this.$router.push('/books')
                        } else {
                            this.$message.error(res.message)
                        }
                    }).catch(error => {
                        console.log('error===', error)

                        this.$message.error(error)
                    })
                }
            })
        }
    },
    created() {
        if (Store.get('isLogin') === 1) {
            this.$router.push('books')
        }
    }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .title {
    font-family: "Times New Roman", Times, serif;
    font-weight: bolder;
    letter-spacing: 4px;
    margin-bottom: 50px;
    font-size: 36px;
  }
  .main {
    width: 30%;
    margin: 0 auto;
    padding: 40px;
    background-color: rgba(10, 10, 10, 0.77);
    border: 2px ridge rgba(238, 238, 238, 0.13);
    border-radius: 5px;
    -moz-box-shadow: 0 -5px 10px 1px rgba(16, 16, 16, 0.57);
    -webkit-box-shadow: 0 -5px 10px 1px rgba(16, 16, 16, 0.57);
    box-shadow: 0 -5px 10px 1px rgba(16, 16, 16, 0.57);
    border-bottom: none;
  }
}
</style>
