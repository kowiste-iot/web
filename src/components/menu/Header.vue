<template>
  <Row class="header-row">
    <Col :breakpoint="EBreakpoint.MD" :size="10">
      <Breadcrumb class="ms-2" />
    </Col>
    <Col :breakpoint="EBreakpoint.MD" :size="2">
      <Flex :justify="EFlexJustify.End">
        <div class="hide-on-mobile" role="button" @click="fullscreen">
          <FIcon
            class="pe-3"
            :icon="EIcon.Expand"
            style="height: 1.2rem; width: 1.2rem"
          />
        </div>
        <Notification />
        <Session />
      </Flex>
    </Col>
  </Row>
</template>

<script setup lang="ts">
// imports
// stores import
// components import
import Breadcrumb from '@/components/menu/BreadCrumb.vue'
import Notification from '@/features/notification/component/Notification.vue'
import Session from '@/components/session/Session.vue'

// model imports
import { EIcon } from '@/features/shared/enum/EIcon'
import Flex from '../layout/Flex.vue'
import Row from '../layout/grid/Row.vue'
import Col from '../layout/grid/Col.vue'
import { EFlexJustify } from '../layout/EFlex'
import { EBreakpoint } from '../layout/grid/model'
// other imports
// props
// data
// storage calls
// computed
// methods
function fullscreen() {
  const element = document.documentElement
  if (!document.fullscreenElement && element?.requestFullscreen) {
    element.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}
// lifeCycle
// watch
</script>

<style scoped>
.header-row {
  color: var(--text-color-subtle);
  padding-top: var(--size-050);
  margin-left: var(--size-050);
}
@media (max-width: 767px) {
  .hide-on-mobile {
    display: none;
  }
}
</style>
