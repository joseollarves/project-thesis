<script setup lang="ts">
const props = defineProps({
  lawyer: {
    type: Object,
    default: {},
  },
});
</script>
<template>
  <NuxtLink
    :to="`/lawyers/${props.lawyer.id}`"
    class="modal-button"
    data-target="modal-card"
  >
    <div class="card" style="border-radius: 10px; margin: 10px">
      <div class="" style="padding: 30px">
        <figure class="image is-1by1">
          <img
            class="is-rounded"
            :src="props.lawyer.profile_picture"
            alt="Placeholder image"
          />
        </figure>
      </div>
      <div class="card-content">
        <div class="media" style="margin-top: -30px">
          <div class="media-content">
            <p class="title is-4" style="color: rgb(59, 59, 59)">
              {{ props.lawyer.name }}
            </p>
            <p class="subtitle is-6" style="color: rgb(108, 108, 108)">
              {{ props.lawyer.description }}
            </p>
          </div>
        </div>
        <div class="content" style="margin-top: -10px">
          <div
            v-for="specialization in props.lawyer.specializations"
            class="button mr-2 is-rounded is-outlined"
            href="#"
          >
            {{ specialization }}
          </div>
          <br />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
