let t;

Component({
  properties: {
    // text: {
    //   type: String,
    //   value: '',
    //   observer(newValue, oldValue) {
    //     if (t) clearTimeout(t)
    //     if (!newValue) return;
    //     t = setTimeout(() => {
    //       this.hide();
    //     }, 300000)
    //   }
    // }
  },
  data: {
    text: ''
  },
  methods: {
    show(text){
      this.setData({text: text});
      if (t) clearTimeout(t)
      t = setTimeout(() => {
        this.hide();
      }, 3000)
    },
    hide() {
      this.setData({ text: '' })
      //触发一个hide事件
      this.triggerEvent('hide', {}, { bubbles: true, composed: true })
    }
  }
})