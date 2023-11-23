<script setup lang="ts">

// Datos del colaborador y el id del admin.
const props = defineProps({
  admin: {
    type: String,
    default: '',
  },
  lawyer: {
    type: Object,
    default: {},
  },
});

// Constante a utilizar
const collaboratorsSelected = useCollaboratorsSelected();

</script>

<template>
  <div class="card" style="margin-bottom: 10px; width: 300px">
    <header class="card-header" style="height: 50px">
      <p class="card-header-title">
        {{ props.lawyer.name }}
      </p>
      <div v-if="props.lawyer.id != props.admin" class="card-header-icon" aria-label="more options">
        <label class="checkbox">
          <input v-model="collaboratorsSelected" :value="props.lawyer.id" type="checkbox" />
        </label>
      </div>
      <div class="card-header-icon" aria-label="more options"></div>
    </header>
    <div class="card-content" style="border-radius: 30px; margin-bottom: -10px">
      <div class="content">
        <figure class="image is-4by3">
          <img
            class="is-rounded"
            :src="props.lawyer.profile_picture"
            alt="Placeholder image"
          />
        </figure>
      </div>
      <div v-if="props.lawyer.id == admin">
        <time datetime="2016-1-1" style="color: rgb(47, 47, 255)">@Admin</time>
        <!--<a class="has-text-link">@Admin</a>-->
      </div>
      <div v-else>
        <time datetime="2016-1-1" style="color: rgb(47, 47, 255)"
          >@Colaborador</time
        >
        <!--<a class="has-text-link">@Colaborador</a>-->
      </div>
    </div>
    <!--<footer class="card-footer">
      <a href="#" class="card-footer-item">Eliminar</a>
    </footer>-->
  </div>
</template>
