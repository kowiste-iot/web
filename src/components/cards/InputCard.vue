
  <template>
    <div class="card col-md-6 " >
    <div class="card-header bg-transparent  d-flex justify-content-between"><slot>
      <p>header</p> <i class="fas fa-skull"></i>
    </slot></div>
    <div class="card-body text-success">
     <slot>body</slot>
    </div>
    <div class="card-footer bg-transparent  d-flex justify-content-between "><slot>
      <Button>save</Button> <Button>cancel</Button>
    </slot></div>
  </div>
  </template>
  
  <script setup lang="ts">
  // imports
  // stores import
  // components import
  // model imports
  // other imports
  // props
  // data
  // storage calls
  // computed
  // methods
  // lifeCycle
  // watch
  </script>
  
  <style scoped></style> 