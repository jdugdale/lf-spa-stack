<template lang="pug">
    #home 
        span Home
        TextDisplay(text="Component text")
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
    
}
</script>
<style>
    #home { text-transform: uppercase; background-color: green; }
</style>