<template>
  <div class="folders">
    <h1>Hello from Vue!</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
const handleClick = () => {
  alert('Button clicked!');
};
</script>

<style scoped>
.folders {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
}
</style>