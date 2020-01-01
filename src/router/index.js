import Vue from 'vue'
import Router from 'vue-router'
import Ebook from '@/components/Ebook'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Root',
            redirect : Ebook
        },
        {
            path: '/ebook',
            name: 'Ebook',
            component: Ebook
        }
    ]
})
