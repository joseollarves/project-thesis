<script setup lang="ts">
const id = useRoute().path.split('/')[2];
const supabase = useSupabaseClient();
const files = ref();
const CDNUrl = 'https://plaqpjhubghluehednib.supabase.co/storage/v1/object/public/projects/';
const fileState = useFileState();

try {
  const { data, error } = await supabase.storage.from('projects').list(id, {
    limit: 100,
    offset: 0,
    sortBy: {column: 'name', order: 'asc'}
  });

  if(error) console.log(error);
  
  if(data != null) {
    files.value = data;
  }
} catch(error) {
  console.log(error)
}

watch(fileState, async() => {
  if(fileState.value == true) {
    const { data, error } = await supabase.storage.from('projects').list(id, {
      limit: 100,
      offset: 0,
      sortBy: {column: 'name', order: 'asc'}
    });

    if(error) console.log(error);

    if(data != null) {
      console.log('se cargo un archivo')
      files.value = data;
      console.log(files.value);
    }
    
    fileState.value = false;
  }
});

</script>
<template>
  <div v-for="file in files" class="column is-4 modal-button" data-target="modal-card">
    <div v-if="file.metadata.mimetype == 'image/jpeg' || file.metadata.mimetype == 'image/png'" class="card is-shady">
      <div class="card-image">
        <figure class="level-item has-text-centered">
          <i class="fa fa-file-image-o fa-2x m-6" aria-hidden="true"></i>
        </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <div class="media-content">
            <a :href="CDNUrl + id + '/' + file.name" target="_blank">{{ file.name }}.{{ file.metadata.mimetype.split('/')[1]}}</a>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="file.metadata.mimetype == 'application/pdf'" class="card is-shady">
      <div class="card-image">
        <figure class="level-item has-text-centered">
          <i class="fa fa-file fa-2x m-6" aria-hidden="true"></i>
        </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <div class="media-content">
            <a :href="CDNUrl + id + '/' + file.name" target="_blank">{{ file.name }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
