<!--
 * @Author: abc
 * @Date: 2020-11-06 10:51:35
 * @LastEditors: abc
 * @LastEditTime: 2021-01-19 09:58:17
 * @Description: footer
-->
<template>
  <div class="footer">
    <div class="footer-top">
      <img src="../assets/image/logo.png" alt="logo" />
      <span>{{ $t('footer.chain') }}</span>
    </div>
    <div class="footer-middle">
      <!-- <div class="footer-middle-item">
        <div class="footer-middle-item-left">
          <a-icon type="mobile" />
        </div>
        <div class="footer-middle-item-right">
          <span>+168-18688-888888</span>
          <span class="footer-middle-item-right-text">{{
            $t('footer.give')
          }}</span>
        </div>
      </div> -->
      <div class="footer-middle-item">
        <div class="footer-middle-item-left">
          <a-icon type="mail" />
        </div>
        <div class="footer-middle-item-right">
          <span>{{ $t('footer.mail') }}</span>
          <span class="footer-middle-item-right-text">{{
            $t('footer.send')
          }}</span>
        </div>
      </div>
      <div class="footer-middle-item">
        <div class="footer-middle-item-left">
          <a-icon type="message" />
        </div>
        <div class="footer-middle-item-right">
          <a
            href="https://github.com/IBAX-io/go-ibax/issues"
            target="_blank"
            style="color:#fff;"
          >
            <span>{{ $t('footer.live') }}</span>
          </a>
          <span class="footer-middle-item-right-text">{{
            $t('footer.get')
          }}</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-item">
        <a href=" https://www.facebook.com/ibaxNetwork/" target="_blank">
          <img src="../assets/image/f.png" alt="f" />
        </a>
        <a href="https://twitter.com/IbaxNetwork" target="_blank">
          <img src="../assets/image/t.png" alt="t" />
        </a>
        <a
          href="https://www.linkedin.com/company/ibaxio/"
          target="_blank"
          style="display: none;"
        >
          <a-icon type="google-plus" />
        </a>
        <a href="https://www.linkedin.com/company/ibaxio/" target="_blank">
          <img src="../assets/image/in.png" alt="in" />
        </a>
      </div>
    </div>
    <div class="footer-bottom-last">
      {{ $t('footer.reserved') }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
      open: ['4'],
      open1: ['3']
    };
  },
  updated() {},
  created() {
    // console.log(this.open);
  },
  watch: {},
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    }
  },
  computed: {
    showList() {
      // console.log(this.$store);
      return this.$store.getters.postFilterRouter;
    }
  }
};
</script>
