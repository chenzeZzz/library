<template>
    <div class="nav-container">
        <header>
            <ul>
                <li class="title fl"
                    @click="toIndex">图书管理系统</li>
                <li class="user-name fs-16">
                    <span style="font-weight: normal;">您好: </span>{{username}}</li>
                <li class="log-out fs-14"
                    @click="logOut">退出</li>
            </ul>
        </header>
    </div>
</template>
<script>
import Store from 'store2'

export default {
    name: 'navbar',
    data() {
        return {
            username: ''
        }
    },
    methods: {
        toIndex() {
            this.$router.push('/')
        },
        logOut() {
            this.$confirm('确认退出？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Store.remove('username')
                Store.set('isLogin', 0)
                this.$router.push('/login')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                })
            })
        },
        created() {
            if (Store.get('isLogin') === 1) {
                this.$router.push('books')
            } else{
                this.$router.push('login')
            }
        }
    },
    mounted() {
        this.created()
        this.username = Store.get('user').username
    },
}
</script>
<style lang="scss" scoped>
@import "../assets/css/variable.scss";

.nav-container {
  header {
    ul {
      padding: 0 20px;
      text-align: right;
      li {
        display: inline-block;
      }
      .title {
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
        color: $main-color;
      }
      .user-name {
        font-weight: 500;
      }
      .log-out {
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
