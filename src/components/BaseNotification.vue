<script setup>
import { ref } from "vue";

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});

const show = ref(false);
const timer = ref(null);

const onShow = (mouse) => {
  if (mouse === "enter") {
    timer.value = setTimeout(() => {
      show.value = true;
    }, 500);
    return;
  }
  clearTimeout(timer.value);
  show.value = false;
};

defineExpose({ onShow });
</script>
<template>
  <transition name="fade">
    <div
      class="notification"
      :style="`left: ${position.left}; top: ${position.top};`"
      v-show="show"
    >
      <slot></slot>
    </div>
  </transition>
</template>
