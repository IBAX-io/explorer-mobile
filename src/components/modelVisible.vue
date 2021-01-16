<!--
 * @Author: abc
 * @Date: 2020-12-10 17:51:42
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 16:07:46
 * @Description: show data model 
-->
<template>
  <a-modal
    v-model="objModal.visible"
    :title="objModal.title"
    :maskClosable="maskClosable"
    width="80%"
  >
    <vue-scroll id="global" class="global" style="height: 100%">
      <div class="modal-content" style="height: 30vh;">
        <json-viewer
          :value="jsonViewer"
          :expand-depth="5"
          :copyable="copyable"
          boxed
          sort
          @copied="onCopy"
        ></json-viewer>
      </div>
    </vue-scroll>
    <div slot="closeIcon"><a-icon type="close" @click="hideModal" /></div>
    <div slot="footer">
      <a-button type="primary" @click="hideModal">{{ $t('sure') }} </a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    objModal: {
      type: Object,
      default: () => {
        return { title: '', visible: false, content: '' };
      }
    }
  },
  data() {
    return {
      maskClosable: false,
      copyable: {
        copyText: this.$t('share'),
        copiedText: this.$t('shared'),
        timeout: 2000
      }
    };
  },
  computed: {
    jsonViewer() {
      return this.handleChangeJson(this.objModal.content);
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onCopy() {
      const copy = this.$t('copySucceeded');
      this.$message.success({ content: copy });
    },
    hideModal() {
      this.$emit('changevisible', false);
    }
  }
};
</script>
