<script setup>
  import { ref, onMounted, watchEffect, toRefs, reactive } from 'vue';
  import { UseModal as Modal, UseModalGroup } from './components/modal';

  const modalVisibles = reactive({});
  modalVisibles.m1 = true;
  setTimeout(() => {
      modalVisibles.m2 = true;
  }, 3000)

  function cacel() {
      modalVisibles.m1 = false;
  }
  function cacel2() {
      console.log(123)
      modalVisibles.m2 = false;
  }


</script>
  
<template>
  <div>show</div>
  <UseModalGroup :order="{m1: 1, m2: 2}" :visibles="modalVisibles" v-slot="visibles">
      <Modal :visible="visibles['m1']">
          <div>这是一个弹窗</div>
          <div @click="cacel">关闭</div>
      </Modal>
      <Modal :visible="visibles['m2']">
          <div>这是另一个弹窗</div>
          <div @click="cacel2">关闭</div>
      </Modal>
  </UseModalGroup>
  <!-- <Modal :visible="isVisible" :mask="false">
      <div>这是一个弹窗</div>
  </Modal> -->
</template>
  