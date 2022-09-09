# vue-modal
An easy-to-use Modal for Vue 3. Multiple modal can pop up orderly.

## Install
`npm i usemodal-vue3`

## CDN
`https://www.unpkg.com/usemodal-vue3@0.1.0/usemodal-vue3.umd.js`

## Usage

```javascript
import { ref } from 'vue';
import { Modal } from 'usemodal-vue3';

let isVisible = ref(false);

<Modal v-model:visible="isVisible">
    <div>your content...</div>
</Modal>
```

Your page may need to pop up multiple modals, and different modals may depend on different data sources, sometimes even asynchronously, you can easily manage their popup order.

```javascript
import { reactive } from 'vue';
import { useModal, Modal } from 'usemodal-vue3';

let setModal = useModal({
    m1: 2, // The larger the number, the later in the order
    m2: 1 // Smaller numbers, first in order
});

let modalVisible = reactive({});

modalVisible = setModal('m1', true);

setTimeout(() => {
    // or  modalVisible = setModal('m2', false)
    modalVisible = setModal('m2', true); // either true or false, you have to define a state.
}, 2000)

// m1 order is 2
<Modal name="m1" v-model:visible="modalVisible">
    <div>This modal will be displayed first</div>
</Modal>
// m2 order is 1, will go first
<Modal name="m2" v-model:visible="modalVisible">
    <div>This modal will be displayed according to the status when the previous one is closed or the display status is fasle</div>
</Modal>
```

## Documentation

### api

| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |