<script setup>
  import { reactive, ref } from 'vue';
//   import { useModal, Modal } from './components/useModal';
  import { useModal, Modal } from 'usemodal-vue3';


  let setModal = useModal({
    m1: 1,
    m2: 3
  });
  let modalVisible = reactive({});
  modalVisible = setModal('m1', true);
  setTimeout(() => {
    modalVisible = setModal('m2', true);
  }, 1000)

  let modalShow = ref(false);

  function cancel() {
    modalVisible = setModal('m1', false);
  }

  function show1() {
    modalVisible = setModal('m1', true);
  }
  function show2() {
    modalVisible = setModal('m2', true);
  }

  function show3() {
    modalShow.value = true;
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
  <div @click="show3">show3</div>
  <Modal name="m1"
     v-model:visible="modalVisible"
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
    v-model:visible="modalVisible"
    :closable="false"
    >
      <div>modal2</div>
  </Modal>
  <Modal
    v-model:visible="modalShow"
    :closable="false"
    >
      <div>modal3</div>
  </Modal>
</template>
  