<template lang="pug">
    p.text {{text}}
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TextDisplay extends Vue {
    @Prop() text: string;
}
</script>
<style>
    p.text{
        border:1px solid lime;padding:0.5em;
    }
    p.text > span { color: magenta; }
</style>