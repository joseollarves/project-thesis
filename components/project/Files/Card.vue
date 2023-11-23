<script setup lang="ts">
// Datos del archivo
const props = defineProps({
  file: {
    type: Object,
    default: {},
  },
});

const runtimeConfig = useRuntimeConfig();

// Constantes a utilizar
const CDNUrl = runtimeConfig.public.supabase.url+'/storage/v1/object/public/projects/';
const id = useRoute().path.split("/")[2];
const fileSelected = useFileSelected();
</script>
<template>
<div class="card" style="margin-bottom: 10px; width: 300px">
    <header class="card-header" style="height: 50px">
      <p class="card-header-title is-size-7-desktop">
        {{ props.file.name }}
      </p>
      <div class="card-header-icon" aria-label="more options">
        <label class="checkbox">
          <input v-model="fileSelected" :value="props.file.name" type="checkbox" />
        </label>
      </div>
      <div class="card-header-icon" aria-label="more options"></div>
    </header>
    <div v-if="props.file.metadata.mimetype == 'image/jpeg' || props.file.metadata.mimetype == 'image/png'" class="card-content" style="border-radius: 30px; margin-bottom: -10px">
      <div class="content">
        <figure class="">
          <i class="fa fa-file-image-o fa-5x m-6" aria-hidden="true"></i>
        </figure>
      </div>
      <div >
        Subido <time datetime="2016-1-1">{{ file.created_at.split("T")[0] }}</time>
      </div>
    </div>
    <div  v-else-if="file.metadata.mimetype == 'application/pdf'" class="card-content" style="border-radius: 30px; margin-bottom: -10px">
      <div class="content">
        <figure class="">
          <i class="fa fa-file-pdf-o fa-5x m-6" aria-hidden="true"></i>
        </figure>
      </div>
      <div >
        Subido <time datetime="2016-1-1">{{ file.created_at.split("T")[0] }}</time>
      </div>
    </div>
    <div  v-else class="card-content" style="border-radius: 30px; margin-bottom: -10px">
      <div class="content">
        <figure class="">
          <i class="fa fa-file-text-o fa-5x m-6" aria-hidden="true"></i>
        </figure>
      </div>
      <div >
        Subido <time datetime="2016-1-1">{{ file.created_at.split("T")[0] }}</time>
      </div>
    </div>
    <footer class="card-footer">
      <NuxtLink
        :href="CDNUrl + id + '/' + file.name"
        target="_blank"
        class="card-footer-item"
        >Abrir</NuxtLink
      >
    </footer>
  </div>
</template>
