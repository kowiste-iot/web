<template>
  <div  class="alert-box">
    
  
    <!-- <font-awesome-icon :icon="['far', 'icon']" v-if="icon" class="icon" />  -->

    <button  class="btn" :class="`btn-${color}`" v-if="color">{{ title }}</button>
  </div>
  </template>
  
  <script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  // imports
  // stores import
  // components import
  // model imports
  // other imports
  // props
  const props=defineProps({
    title: {
      type:String,
      default:''
    },
    icon: {
      type:String,
      default:''
    },
    color:{
      type: String,
      default:''
    }
})
  // data
  // storage calls
  // computed
  // methods
  // lifeCycle
  // watch
  </script>
  
  <style scoped></style> 