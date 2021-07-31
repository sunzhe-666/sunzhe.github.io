// 导入vue
import vue from 'vue'

// 注册全局自定义指令
vue.directive('err', {
  inserted(el, binding) {
    console.log('123')
    el.onerror = function() {
      console.log(binding)
      this.src = binding.value
    }
  }
})
