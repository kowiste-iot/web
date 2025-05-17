<template>
  <div class="position-absolute tour" style="height: 100%; width: 100%">
    <div
      class="bg-dark opacity-50 position-absolute"
      style="height: 100%; width: 100%"
    ></div>
    <div class="position-relative full-height">
      <div class="container full-height">
        <div class="row full-height align-items-center">
          <div class="col-md-8 mx-auto">
            <Card id="tour-card" showHeader showFooter>
              <template #header>
                <div class="d-flex flex-column full-width gap-2">
                  <div>Walkthrough Tour</div>
                  <div class="progress" style="height: 20px; width: 100%">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      style="width: 20%"
                      aria-valuenow="20"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      20%
                    </div>
                  </div>
                  <div class="d-flex justify-content-end">
                    <Button
                      :color="EColor.Warning"
                      size="sm"
                      @click="markComplete"
                    >
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </template>

              <div class="tour-content">
                <ul class="list-unstyled">
                  <li v-for="(tour, index) in tours" :key="index" class="mb-2">
                    <div class="d-flex justify-content-between gap-2">
                      <div class="d-flex gap-3">
                        <Button
                          :color="EColor.Success"
                          :icon="EIcon.Play"
                          small
                          @click="startTour(tour.id)"
                        />
                        <div>{{ tour.name }}</div>
                      </div>

                      <div class="text-start">{{ tour.description }}</div>
                    </div>
                  </li>
                </ul>
              </div>

              <template #footer>
                <div class="d-flex full-width justify-content-between">
                  <Button :color="EColor.Primary" @click="startTour">
                    Follow
                  </Button>
                  <Button :color="EColor.Secondary" outline @click="closeTour">
                    Cancel
                  </Button>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/features/session/store/useSessionStore'
import { EColor } from '@/features/shared/enum/EColor'
import { useTourStore } from '../../stores/useTourStore'
import Card from '@/components/cards/Card.vue'
import Button from '@/components/buttons/Button.vue'
import { computed } from 'vue'
import { EIcon } from '@/features/shared/enum/EIcon'
import logger from '@/utils/log/logger'

const sessionStore = useSessionStore()
const tourStore = useTourStore()

const tours = computed(() => tourStore.availableTours)

function startTour(tourID: string) {
  tourStore.startTour(tourID)
  sessionStore.openTour = false
}

function closeTour() {
  sessionStore.openTour = false
}

function markComplete() {
  tourStore.endTour()
  logger.info('Tour marked as complete')
}
</script>

<style scoped>
.tour-content {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
