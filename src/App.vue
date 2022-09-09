<script setup>
  import { reactive } from 'vue';
  import { useModal, Modal } from './components/useModal';


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

  function cancel() {
    modalVisible = setModal('m1', false);
  }

  function show1() {
    modalVisible = setModal('m1', true);
  }
  function show2() {
    modalVisible = setModal('m2', true);
  }

  function okfn() {
    modalVisible = setModal('m1', false);
  }

  function onVisible() {
    console.log('onVisible')
  }

  function onUnVisible() {
    console.log('onUnVisible', )
  }
</script>
  
<template>
  <div @click="show1">show1</div>
  <div @click="show2">show2</div>
  <Modal name="m1"
     ref="ss"
     :visible="modalVisible"
     :okButton = "{
        onclick: okfn
     }"
     :cancelButton = "{
        onclick: cancel
     }"
     @onVisible="onVisible"
     @onUnVisible="onUnVisible"
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
  