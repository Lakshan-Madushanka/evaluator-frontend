<template>
  <div class="bg-gray-100">
    <slot name="header"></slot>
    <div class="border-2 shadow-xl whitespace-nowrap">
      <slot name="table"></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
