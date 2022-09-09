<script setup>
  import { ref, onMounted, watchEffect, toRefs, reactive } from 'vue';
//   import { Modal, ModalGroup } from './components/modal';
  import { useModal, Modal } from './components/useModal';
//   import { UseModal as Modal, UseModalGroup } from 'modal-vue3';


  let setModal = useModal({
    m1: 1,
    m2: 3
  });
  let modalVisible = reactive({});
  modalVisible = setModal('m1', true);
  setTimeout(() => {
    modalVisible = setModal('m2', true);
  }, 3000)

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

  function show1() {
    modalVisible = setModal('m1', true);
  }
  function show2() {
    modalVisible = setModal('m2', true);
  }

  function okfn() {
    console.log(111)
  }


</script>
  
<template>
  <div @click="show1">show1</div>
  <div @click="show2">show2</div>
  <!-- <ModalGroup 
      :order="{m1: 1, m2: 2}"
      :visibles="modalVisibles"
      v-slot="visibles"
      >
      <Modal :visible="visibles['m1']">
          <div>这是一个弹窗</div>
          <div @click="cacel">关闭</div>
      </Modal>
      <Modal :visible="visibles['m2']">
          <div>这是另一个弹窗</div>
          <div @click="cacel2">关闭</div>
      </Modal>
  </ModalGroup> -->
  <Modal name="m1" 
     :visible="modalVisible"
     :okButton = "{
        text:'确认',
        onclick: okfn
     }"
     >
      <div>modal1</div>
  </Modal>
  <Modal name="m2" 
    :visible="modalVisible"
    :closable="false"
    >
      <div>modal2</div>
  </Modal>
</template>
  