<template lang="pug">
    .content
        Home
        TextDisplay(:text="text")
        footer
            p Footer content
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Home from './pages/Home.vue';

@Component({ components: { Home }})
export default class App extends Vue {
    
    text: string = '';
    mounted() {
        this.text = 'hello world';
    }
}

</script>
<style>
    body { background-color: #034; color: #EEE; }
</style>