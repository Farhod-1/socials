<template>
  <div class="placeholder-container">
    <div style="text-align: center">
      <img :src="icon" width="120" />
      <div style="color: #697e92; font-size: 20px; margin-top: 14px" v-html="text" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlaceholderContainer',

  props: {
    icon: String,
    text: String
  }
})
</script>

<style>
.placeholder-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
