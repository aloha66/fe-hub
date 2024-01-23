<script setup>
import OffestParent from "./demo/OffestParent.vue"
import AllowAnyClick from "./demo/AllowAnyClick.vue"
import Axis from "./demo/Axis.vue"
import Bound from "./demo/Bound.vue"
import Cancel from "./demo/Cancel.vue"
import DefaultPosition from "./demo/DefaultPosition.vue"
import Grid from "./demo/Grid.vue"
import Event from "./demo/Event.vue"
import Position from "./demo/Position.vue"

</script>

## useDraggable
### Demo
#### Position
<Position/>
#### Event
<Event/>
#### Grid
<Grid/>
#### DefaultPosition
<DefaultPosition/>
#### Cancel&Disabled&Handle
<Cancel/>
#### Bound
<Bound/>
#### Axis
<Axis/>
#### AllowAnyClick
<AllowAnyClick/>
#### OffestParent
<OffestParent/>

## 注意事项
1. useDraggable的el只能是HTMLElement type，如果是vue component，建议改用UseDraggable的组件形式
2. 处理多个组件的时候，建议改用UseDraggable的组件形式
