<script lang="ts" setup>
import { onMounted } from 'vue'
import { CountDown } from './index'

const cd = new CountDown({ leftTime: 5000, onCountChange(e) {
  console.log('ee', e)
} })

onMounted(() => {
  cd.run()
})
</script>
