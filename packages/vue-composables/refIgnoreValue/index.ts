import { ref } from 'vue';

export function refIgnoreValue(target: Object, key: PropertyKey) {
  let value = ref(); // 创建私有变量
  Object.defineProperty(target, key, {
    get() {
      return value.value;
    },
    set(val) {
      value.value = val;
    },
    enumerable: true,
    configurable: true,
  });
}
