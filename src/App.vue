<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
    //DOMContentLoaded事件动态设置根元素font-size
    document.addEventListener('DOMContentLoaded', () => {
        const html = document.querySelector('html');
        let fontSize = window.innerWidth / 10;
        fontSize = fontSize > 50 ? 50 : fontSize;
        html.style.fontSize = fontSize + 'px';
    })
</script>

