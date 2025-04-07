<template>
  <div class="vuefinder" ref="root" tabindex="0">
    <div :class="app.theme.actualValue" style="height: 100%;">
      <div
        :class="app.fullScreen ? 'vuefinder__main__fixed' : 'vuefinder__main__relative'"
        :style="'height: 100%;'+(!app.fullScreen ? 'max-height: ' + maxHeight : '')"
        class="vuefinder__main__container"
        @mousedown="app.emitter.emit('vf-contextmenu-hide')"
        @touchstart="app.emitter.emit('vf-contextmenu-hide')">
        <Toolbar/>
        <Breadcrumb/>
        <div class="vuefinder__main__content">
          <TreeView/>
          <Explorer/>
        </div>
        <Statusbar/>
      </div>

      <Transition name="fade">
        <Component v-if="app.modal.visible" :is="app.modal.type"/>
      </Transition>

      <ContextMenu/>
    </div>
  </div>
</template>

<script setup>
import {inject, onMounted, provide, ref, watch} from 'vue';
import ServiceContainer from "../ServiceContainer.js";
import {useHotkeyActions} from "../composables/useHotkeyActions.js";

import Toolbar from '../components/Toolbar.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import Explorer from '../components/Explorer.vue';
import ContextMenu from '../components/ContextMenu.vue';
import Statusbar from '../components/Statusbar.vue';
import TreeView from '../components/TreeView.vue';
import { itemBundle,templateMap, menuItems as contextMenuItems } from '../utils/contextmenu.js';


const emit = defineEmits(['select', 'update:path'])

const props = defineProps({
  id: {
    type: String,
    default: 'vf'
  },
  request: {
    type: [String, Object],
    required: true,
  },
  persist: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    default: '',
  },
  features: {
    type: [Array, Boolean],
    default: true,
  },
  debug: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: 'system',
  },
  locale: {
    type: String,
    default: null
  },
  maxHeight: {
    type: String,
    default: '600px'
  },
  maxFileSize: {
    type: String,
    default: '10mb'
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  showTreeView: {
    type: Boolean,
    default: false
  },
  pinnedFolders: {
    type: Array,
    default: []
  },
  showThumbnails: {
    type: Boolean,
    default: true
  },
  selectButton: {
    type: Object,
    default(rawProps) {
      return {
        active: false,
        multiple: false,
        click: (items) => {
          // items is an array of selected items
          // 
        },
        ...rawProps,
      }
    },
  },
  // 文件夹 文件夹右键菜单
  /*
  * 输入示例
  * [{ label: "解压", show: (item) => true, handler: (items) => { } }]
  * */

  menu: {
    type: Array,
    default: []
  },
  onError: {
    type: Function,
    default: null,
  },
  loadingIndicator: {
    type: String,
    default: 'circular'
  },
  contextMenuItems: {
    type: Array,
    default: () => contextMenuItems
  },
});

// 将自定义点击按钮添加
props.menu.forEach( r => {
  let bundle = itemBundle([{
    key: r.label,
    title: ({t}) => {
      return t(r.label) || r.label // 按钮标签
    },
    action: r.handler // 按钮点击事件
  }])
  if(r?.show) bundle[0].show = r?.show // 判断菜单是否需要显示
  // 自定义按钮位置（原本的按钮可能位置比较靠前，设置需要往后延续）
  if(r?.index) {
    props.contextMenuItems.splice(r.index + 9,0,...bundle)
  } else {
    props.contextMenuItems.push(
        ...bundle
    )
  }
})

// the object is passed to all components as props
// 对象作为道具传递给所有组件
const app = ServiceContainer(props, inject('VueFinderOptions'));
provide('ServiceContainer', app);
const {setStore} = app.storage;

//  Define root element
const root = ref(null);
app.root = root;

// Define dragSelect object
const ds = app.dragSelect;

useHotkeyActions(app);

const updateItems = (data) => {
  Object.assign(app.fs.data, data);
  ds.clearSelection();
  ds.refreshSelection();
};

/** @type {AbortController} */
let controller;
app.emitter.on('vf-fetch-abort', () => {
  controller.abort();
  app.fs.loading = false;
});

// Fetch data
app.emitter.on('vf-fetch', ({params, body = null, onSuccess = null, onError = null, noCloseModal = false}) => {
  if (['index', 'search'].includes(params.q)) {
    if (controller) {
      controller.abort();
    }
    app.fs.loading = true;
  }

  controller = new AbortController();
  const signal = controller.signal;
  app.requester.send({
    url: '',
    method: params.m || 'get',
    params,
    body,
    abortSignal: signal,
  }).then(data => {
    app.fs.adapter = data.adapter;
    if (app.persist) {
      app.fs.path = data.dirname;
      setStore('path', app.fs.path);
    }

    
    if (!noCloseModal) {
      app.modal.close();
    }
    updateItems(data);
    if (onSuccess) {
      onSuccess(data);
    }
  }).catch((e) => {
    console.error(e)
    if (onError) {
      onError(e);
    }
  }).finally(() => {
    if (['index', 'search'].includes(params.q)) {
      app.fs.loading = false;
    }
  });
});

/**
 * fetchPath fetches the items of the given path
 * if no path is given, the backend should return the root of the current adapter
 * @param path {string | undefined} example: 'media://public'
 */
 function fetchPath(path) {
  let pathExists = {};

  if (path && path.includes("://")) {
    pathExists = {
      adapter: path.split("://")[0],
      path: path
    };
  }

  app.emitter.emit('vf-fetch', {
    params: {q: 'index', adapter: app.fs.adapter, ...pathExists}, 
    onError: props.onError ?? ((e) => {
      if (e.message) {
        app.emitter.emit('vf-toast-push', {label: e.message, type: 'error'})
      }
    })
  });
}

// fetch initial data
onMounted(() => {
  // app.fs.adapter can be null at first, until we get the adapter list it will be the first one from response
  // later we can set default adapter from a prop value

  // if there is a path coming from the prop, we should use it.
  fetchPath(app.fs.path)

  // We re-fetch the data if the path prop is updated
  watch(() => props.path, (path) => {
    fetchPath(path)
  }) 

  // Emit select event
  ds.onSelect((items) => {
    emit('select', items);
  });

  // Emit update:path event
  watch(() => app.fs.data.dirname, (path) => {
    emit('update:path', path)
  })

});

</script>