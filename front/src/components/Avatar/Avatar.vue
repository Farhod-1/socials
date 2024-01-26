<template>
  <div class="avatar__img">
    <img alt="person" class="avatar__img-img" src="@/assets/img/profile-user.svg" />
    <span v-if="status" class="avatar__img-status"></span>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  status: {
    type: Boolean,
    default: true
  }
})
</script>
<script lang="ts">
export default { name: 'BaseAvatar' }
</script>

<style lang="scss" scoped>
@import '/src/assets/styles/base/customize';

.avatar {
  &__img {
    width: 45px;
    height: 45px;
    display: flex;
    flex-shrink: 0;
    position: relative;

    &-img {
      opacity: 0.15;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }

    &-status {
      z-index: 2;
      bottom: 5px;
      right: 3px;
      width: 15px;
      height: 15px;
      position: absolute;
      background: $green;
      border-radius: 100%;
      border: 3px solid $white;
    }
  }
}
</style>
