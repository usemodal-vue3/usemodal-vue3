<script setup>
    import { reactive, ref, onUnmounted } from 'vue';
    import { useModal, Modal } from './components/useModal';
    // import { useModal, Modal } from 'usemodal-vue3';
  
    const handle = ref();
  
    const setModal = useModal({
      m1: 4,
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
      setTimeout(() => {
        modalVisible = setModal('m2', false);
      }, 1000)
    }
  
    function cancelfn() {
      setTimeout(() => {
        modalShow.value = false;
      }, 1000)
    }
  
    function onVisible() {
      console.log('onVisible')
    }
  
    function onVisible2() {
      console.log('onVisible22')
    }
  
    function onUnVisible() {
      console.log('onUnVisible2', )
    }
    function onUnVisible1() {
      console.log('onUnVisible1', )
    }

    onUnmounted(() => {
    })
    
  </script>
    
  <template>
    <div @click="show1">show1</div>
    <div @click="show2">show2</div>
    <div @click="show3">show3</div>
    <Modal name="m1"
       v-model:visible="modalVisible"
       :cancelButton = "{
          onclick: cancel
       }"
       :draggable= "handle"
       @onVisible="onVisible"
       @onUnVisible="onUnVisible1"
       >
        <div ref="handle" style="cursor: move;">modal1. hold here to drag</div>
    </Modal>
    <Modal name="m2" 
      v-model:visible="modalVisible"
      :closable="false"
      :draggable= "true"
      @onVisible="onVisible2"
      @onUnVisible="onUnVisible"
      :okButton="{
        onclick: okfn,
        loading: true
      }"
      >
        <div>modal2</div>
    </Modal>
    <Modal
      v-model:visible="modalShow"
      :closable="false"
      :cancelButton="{
        onclick: cancelfn,
        loading: true
      }"
      >
        <div>modal3</div>
    </Modal>
  </template>
    