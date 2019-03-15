import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Books from '@/views/books'
import Wishes from '@/views/wishes'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: 'books'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/books',
            name: 'Books',
            component: Books
        },
        {
            path: '/wishes',
            name: 'Wishes',
            component: Wishes
        }
    ]
})
