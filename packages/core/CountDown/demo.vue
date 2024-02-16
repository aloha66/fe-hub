<script lang="ts" setup>
import { onMounted } from 'vue'
import { CountDown } from './index'

// const cd = new CountDown({ relativeTime: 10 * 1000, onCountChange(e) {
//   console.log('ee', e)
// } })

const cd = new CountDown({ isIncrement: true, relativeTime: 10 * 1000, onCountChange(e) {
  console.log('ee', e)
} })
</script>
