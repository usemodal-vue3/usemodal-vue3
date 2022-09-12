<script setup>
  import { ref, computed } from 'vue'
  import Page1 from './Page1.vue'
  import Page2 from './Page2.vue'
  const routes = {
    '/': Page1,
    '/page2': Page2
  }
  const currentPath = ref(window.location.hash)
  window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash
  })
  const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound
  })
  </script>
  <template>
    <a href="#/">Home</a> |
    <a href="#/page2">Page2</a> |
    <component :is="currentView" />
  </template>