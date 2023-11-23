<script setup lang="ts">

// Datos del abogado
const props = defineProps({
  lawyer: {
    type: Object,
    default: {}
  }
});
</script>

<template>
  <div class="column is-3 modal-button" data-target="modal-card">
    <div class="card is-shady" style="border-radius: 50px;">
      <div class="" style="padding: 20px;">
        <figure class="image is-1by1">
          <img class="is-rounded" alt="Placeholder image" :src="props.lawyer.profile_picture" />
        </figure>
      </div>
      <div class="card-content" style="margin-top: -30px; margin-bottom: -40px;">
        <div class="content">
          <div class="media-content">
            <p class="title is-4">{{ props.lawyer.name }}</p>
          </div>
        </div>
        <div style="text-align: center; background-color: gainsboro; border-radius: 50px; margin-top: -15px;">
          <span class="icon">
              <i class="fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-teal"></i>
            </span>
          <span class="is-4">Especializaciones</span>
        </div>
        
        <div class="content">
          <span v-for="specialization in props.lawyer.specializations" class="icon-text is-flex" style="margin-left: 10px; margin-top: 10px;">
            <span class="icon">
              <i class="fa fa-circle" aria-hidden="true"></i>
            </span>
            <span>{{ specialization }}</span>
          </span>
          <br />
          <div style="text-align: center; background-color: gainsboro; border-radius: 50px; margin-top: -10px;">
          <span class="icon">
            <i class="fa fa-id-card fa-fw w3-margin-right w3-large w3-text-teal"></i>
            </span>
          <span class="is-4">Sobre mí</span>
          </div>
          <span class="icon-text" style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px;">
            <span>{{ props.lawyer.description }}</span>
          </span>
          <div style="text-align: center; background-color: gainsboro; border-radius: 50px; margin-bottom: 10px;">
          <span class="icon">
            <i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>
            </span>
          <span class="is-4">Correo Electrónico</span>
          </div>
          <span class="icon-text" style="margin-left: 10px;">
            <span>email@example.com</span>
          </span>
          <br />
        </div>
      </div>
      <hr>
      <div class="buttons has-addons is-centered" style="margin-top: -15px;">
        <NuxtLink :to="`/profile/${props.lawyer.id}/edit`" class="button is-rounded">Editar</NuxtLink>
      </div>
    </div>
  </div>
</template>
