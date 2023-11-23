<script setup lang="js">
// Constantes a utilizar
const id = useRoute().path.split("/")[2];
const supabase = useSupabaseClient();
const fileState = useFileState();
const fileSelected = useFileSelected();

// Funcion de subir archivos
async function uploadFiles(e) {
  const files = e.target.files;

  for(let i = 0; i < files.length; i++) {
    const { error } = await supabase.storage
    .from("projects")
    .upload(id + "/" + files[i].name, files[i]);
    
    if (error) {
      console.log(error);
      break;
    }
  }
  fileState.value = true;
}

// Funcion de eliminar archivos
async function deleteFiles() {
  if(fileSelected.value.length > 0) {
    for(let i = 0; i < fileSelected.value.length; i++) {
      const { error } = await supabase.storage
      .from("projects")
      .remove([id + "/" + fileSelected.value[i]]);
      if (error) {
        console.log(error);
        break;
      }
    }
    fileState.value = true;
  } else {
    console.log('No ha seleccionado ningun archivo');
  }
}
</script>

<template>
  <div class="block">
    <div class="block">
      <div class="columns is-mobile is-centered" style="margin-top: 10px">
        <div class="field is-grouped">
          <div class="buttons has-addons is-centered">
            <div class="field has-addons">
              <p class="control">
                <button class="button is-small is-rounded">
                  <input
                    class="file-input"
                    type="file"
                    @change="uploadFiles"
                    multiple
                  />
                  <span>Subir Archivo(s)</span>
                </button>
              </p>
              <p class="control">
                <button @click="deleteFiles" class="button is-small is-rounded">
                  <span>Eliminar Archivo(s)</span>
                </button>
              </p>
              <!--<p class="control">
                            <button @click="createFolder" class="button is-small is-rounded">
                              <span>Crear Carpeta</span>
                            </button>
                          </p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
