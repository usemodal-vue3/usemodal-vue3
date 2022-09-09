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

<Modal v-model:visible="modalShow">
    <div>your content...</div>
</Modal>
```