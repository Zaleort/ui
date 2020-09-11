<template>
  <div
    :class="{
      'ui-upload': true,
    }"
    tabindex="0"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <ui-upload-dragger
      v-if="drag"
      :disabled="disabled"
      :accept="accept"
      @file="uploadFiles"
    >
      <ui-icon
        icon="paperclip"
        size="x3"
        class="mb-3"
      />
      <span>Subir archivos</span>
    </ui-upload-dragger>
    <slot v-else />
    <input
      ref="input"
      class="ui-upload__input"
      type="file"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      @change="handleChange"
    >
    <slot name="tip" />
  </div>
  <ui-upload-list
    :disabled="disabled"
    :files="uploadFileList"
    @remove="handleRemove"
  />
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, watch, PropType,
} from 'vue';
import { UiUploadFile } from '@/interfaces/Upload';
import ajax from '@/lib/ajax';

export default defineComponent({
  name: 'UiUpload',
  props: {
    action: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: 'file',
    },

    drag: {
      type: Boolean,
      default: false,
    },

    data: {
      type: Object,
      default: null,
    },

    headers: {
      type: Object,
      default: null,
    },

    withCredentials: {
      type: Boolean,
      default: false,
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    accept: {
      type: String,
      default: '',
    },

    onStart: {
      type: Function,
      default: () => {},
    },

    onChange: {
      type: Function,
      default: () => {},
    },

    onProgress: {
      type: Function,
      default: () => {},
    },

    onSuccess: {
      type: Function,
      default: () => {},
    },

    onError: {
      type: Function,
      default: () => {},
    },

    beforeRemove: {
      type: Function,
      default: () => {},
    },

    beforeUpload: {
      type: Function,
      default: () => {},
    },

    onRemove: {
      type: Function,
      default: () => {},
    },

    fileList: {
      type: Array as PropType<UiUploadFile[]>,
      default: () => [],
    },

    autoUpload: {
      type: Boolean,
      default: true,
    },

    listType: {
      type: String,
      default: null,
    },

    httpRequest: {
      type: Function,
      default: ajax,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    limit: {
      type: Number,
      default: 0,
    },

    onExceed: {
      type: Function,
      default: () => {},
    },
  },

  setup(props) {
    const input = ref<HTMLInputElement | null>(null);
    const reqs = reactive<any>({});
    const tempIndex = ref(1);
    const isImage = (str: string) => str.indexOf('image') !== -1;
    const uploadFileList = ref<UiUploadFile[]>([]);

    watch(props.fileList, () => {
      uploadFileList.value = props.fileList;
    });

    const getFile = (rawFile: any): any => {
      const fileList = uploadFileList.value;
      let target;
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });

      return target;
    };

    const abort = (file: any) => {
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    };

    const handleStart = (rawFile: any) => {
      rawFile.uid = Date.now() + tempIndex.value++;
      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile,
      };

      uploadFileList.value.push(file);
      props.onChange(file, uploadFileList.value);
    };

    const handleProgress = (e: ProgressEvent | any, rawFile: any) => {
      const file = getFile(rawFile);
      if (!file) return;

      props.onProgress(e, file, uploadFileList.value);
      file.status = 'uploading';
      file.percentage = e.percent || 0;
    };

    const handleSuccess = (res: any, rawFile: any) => {
      const file = getFile(rawFile);
      if (file) {
        file.status = 'success';
        file.response = res;
        props.onSuccess(res, file, uploadFileList.value);
        props.onChange(file, uploadFileList.value);
      }
    };

    const handleError = (err: any, rawFile: any) => {
      const file = getFile(rawFile);
      const fileList = uploadFileList.value;
      file.status = 'fail';
      // fileList.splice(fileList.indexOf(file), 1);
      props.onError(err, file, uploadFileList.value);
      props.onChange(file, uploadFileList.value);
    };

    const handleRemove = (file: any, raw: any) => {
      if (raw) {
        file = getFile(raw);
      }

      const doRemove = () => {
        abort(file);
        const fileList = uploadFileList.value;
        fileList.splice(fileList.indexOf(file), 1);
        props.onRemove(file, fileList);
      };

      const before = props.beforeRemove(file, uploadFileList.value);
      if (before && before.then) {
        before.then(() => {
          doRemove();
        }, () => {});
      } else {
        doRemove();
      }
    };

    const handleClick = () => {
      if (!props.disabled && input.value) {
        input.value.value = '';
        input.value.click();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.target !== e.currentTarget) return;
      if (e.keyCode === 13 || e.keyCode === 32) {
        handleClick();
      }
    };

    const post = (rawFile: any) => {
      const { uid } = rawFile;
      const options = {
        headers: props.headers,
        withCredentials: props.withCredentials,
        file: rawFile,
        data: props.data,
        filename: props.name,
        action: props.action,
        onProgress: (e: ProgressEvent) => {
          handleProgress(e, rawFile);
        },
        onSuccess: (res: any) => {
          handleSuccess(res, rawFile);
          delete reqs[uid];
        },
        onError: (err: any) => {
          handleError(err, rawFile);
          delete reqs[uid];
        },
      };

      const req = props.httpRequest(options);
      reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    };

    const upload = (rawFile: any) => {
      if (!input.value) return null;

      input.value.value = '';
      if (!props.beforeUpload) {
        return post(rawFile);
      }

      const before = props.beforeUpload(rawFile);
      if (before && before.then) {
        before.then((processedFile: any) => {
          const fileType = Object.prototype.toString.call(processedFile);
          if (fileType === '[object File]' || fileType === '[object Blob]') {
            if (fileType === '[object Blob]') {
              processedFile = new File([processedFile], rawFile.name, {
                type: rawFile.type,
              });
            }

            Object.keys(rawFile).forEach(p => processedFile[p] = rawFile[p]);

            return post(processedFile);
          }

          return post(rawFile);
        }, () => {
          handleRemove(null, rawFile);
        });
      } else if (before !== false) {
        return post(rawFile);
      } else {
        handleRemove(null, rawFile);
      }

      return null;
    };

    const uploadFiles = (files: FileList) => {
      if (props.limit && props.fileList.length + files.length > props.limit) {
        props.onExceed(files, props.fileList);
        return;
      }

      let postFiles = Array.prototype.slice.call(files);
      if (!props.multiple) { postFiles = postFiles.slice(0, 1); }
      if (postFiles.length === 0) { return; }
      postFiles.forEach(rawFile => {
        handleStart(rawFile);
        if (props.autoUpload) upload(rawFile);
      });
    };

    const handleChange = (e: any) => {
      const { files } = e.target;
      if (!files) return;
      uploadFiles(files);
    };

    const clearFiles = () => {
      uploadFileList.value = [];
    };

    const submit = () => {
      uploadFileList.value
        .filter(file => file.status === 'ready')
        .forEach(file => {
          upload(file.raw);
        });
    };

    return {
      uploadFileList,
      tempIndex,
      input,
      isImage,
      uploadFiles,
      upload,
      abort,
      post,
      handleKeydown,
      handleClick,
      handleChange,
      handleProgress,
      handleRemove,
      handleStart,
      handleSuccess,
      handleError,
      getFile,
      clearFiles,
      submit,
    };
  },
});
</script>
