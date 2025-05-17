<template>
  <Modal>
    <Row>
      <Col :breakpoint="EBreakpoint.MD" :size="6">
        <Card showHeader showFooter>
          <template #header>
            <Flex :gap="3">
              <FIcon :icon="EIcon.Credential" />
              <div>Device credential</div>
            </Flex>
          </template>
          <div class="alert-card">
            <Alert :color="EColor.Warning">
              <div class="alert-content">
                <FIcon :icon="EIcon.Alert" /><strong>Important!</strong>
                <p>
                  This is the only time you will see this. Please copy
                  and save this information securely. If you lose this password,
                  you will need to regenerate new credentials.
                </p>
              </div>
            </Alert>
            <Flex column>
              <label>Client ID</label>
              <InputLabel copy :value="data?.clientID" @copy="copyClip(data?.clientID)" />
            </Flex>
            <Flex column>
              <label>User Name</label>
              <InputLabel copy :value="data?.id" @copy="copyClip(data?.id)" />
            </Flex>
            <Flex column>
              <label>Password</label>
              <InputLabel
                show
                copy
                :type="show ? 'text' : 'password'"
                :value="data?.password"
                @show="() => (show = !show)"
                @copy="copyClip(data?.password)"
              />
            </Flex>
          </div>

          <template #footer>
            <Flex reverse>
              <Button :color="EColor.Warning" @click="emit('close')">
                Close
              </Button>
            </Flex>
          </template>
        </Card>
      </Col>
    </Row>
  </Modal>
</template>

<script setup lang="ts">
import Card from '@/components/cards/Card.vue'
import type { IDevicePassword } from '../../domain/device'
import Modal from '@/components/layout/Modal.vue'
import Row from '@/components/layout/grid/Row.vue'
import Col from '@/components/layout/grid/Col.vue'
import { EBreakpoint } from '@/components/layout/grid/model'
import Flex from '@/components/layout/Flex.vue'
import Button from '@/components/buttons/Button.vue'
import { EColor } from '@/features/shared/enum/EColor'
import Alert from '@/components/cards/Alert.vue'
import { EIcon } from '@/features/shared/enum/EIcon'
import InputLabel from '@/components/form/InputLabel.vue'
import { ref } from 'vue'

// imports
// stores import
// components import
// model imports
// other imports
// props
interface Props {
  data?: IDevicePassword
}
const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()
// data
const show = ref(false)
// storage calls
// computed
// methods
function copyClip(data?: string) {
  if (!data) return
  navigator.clipboard.writeText(data)
}
// lifeCycle
// watch
</script>

<style scoped>
.alert-content {
  padding: var(--size-100) var(--size-200);
}
.alert-card {
  padding: var(--size-200);
}
</style>
