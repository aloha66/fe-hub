<script setup lang="ts">
import { refIgnoreValue } from '.';


class Test {
  // state = createReactiveProperty('initialValue1','state');

  // #state = ref<{ aa: number }>()

  // get state() {
  // console.log('get')
  // return this.#state.value
  // }

  // set state(val) {
  // console.log('val',val)
  // this.#state.value = val
  // }

  @refIgnoreValue
  state1 = {
      aa: 0
    };

  @refIgnoreValue
  state2:number;

  constructor() {
    this.reset()
    console.log('state',this.state1);
    this.state2 = 666

  }

  get aa() {
    return this.state1.aa
  }

  reset() {
    this.state1 = {
      aa: 1
    }
  }

  changeVal() {
    this.state1.aa = 3
  }
}


const test = new Test()

const handleWe = () => {
  // @ts-ignore
  test.state2 = {ss:233}

}
</script>
<template>
  <div>
   <p>
    get 存取器 :{{test?.aa}}
   </p>
   <p>
    state的值 {{ test.state1 }}
   </p>
<button @click="test?.changeVal">点击改变aa的值</button>
</div>
{{  test.state2  }}
<div @click="handleWe">点击改变state2的值</div>

</template>
