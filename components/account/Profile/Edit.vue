<script setup lang="js">
// Tipo Abogado
/*interface lawyer {
  id: string;
  name: string | null;
  email: string | null;
  description: string | null;
  specializations: string[];
  profile_picture: string | null;
}*/

// Datos del abogado
const props = defineProps({
  lawyer: {
    type: Object,
    default: {},
  },
});

// Constantes a utilizar
const supabase = useSupabaseClient();
const id = useRoute().path.split("/")[2];
const lawyer = ref(props.lawyer);
const picture_route = ref();
const picturesUploaded = [];
const possibleSpecializations = ref(["Penal", "Civil", "Mercantil"]);
const CDNUrl = 'https://plaqpjhubghluehednib.supabase.co/storage/v1/object/public/lawyers/';

// Obtenemos la ruta de la foto de perfil si es que existe
if(lawyer.value.profile_picture != null) {
  picture_route.value = lawyer.value.profile_picture;
  picturesUploaded.push(picture_route.value.split('/')[9]);
} else {
  picture_route.value = '';
}

// Funcion de cambiar foto
async function changePicture(e) {
  const file = e.target.files[0];

  const { error } = await supabase.storage
    .from("lawyers")
    .upload(id + "/" + file.name, file);

  if (error) return (error);

  picturesUploaded.push(file.name);
  picture_route.value = CDNUrl + id + '/' + file.name;
}

// Funcion de editar abogado
async function editLawyer(lawyer) {
  if(lawyer.name == '') {
    console.log('Ha ingresado un nombre nulo');
  } else if(lawyer.description == '') {
    console.log('Ha ingresado una descripcion nula');
  } else if(lawyer.specializations.length == 0) {
    console.log('No ha seleccionado ninguna especializacion');
  } else {
    
    const { error } = await supabase.from("lawyers").update({
      name: lawyer.name,
      description: lawyer.description,
      specializations: lawyer.specializations,
      profile_picture: picture_route.value }).eq('id', lawyer.id);
    
    if(error) return (error);
    
    for(let i in picturesUploaded) {
      if(picture_route.value.split('/')[9] != picturesUploaded[i]) {
        const { error } = await supabase.storage.from("lawyers").remove(id + "/" + picturesUploaded[i]);
        if(error) {
          return error
        }
      }
    }
    return navigateTo('/profile');
  }
}

</script>

<template>
  <div class="column is-3 modal-button " data-target="modal-card">
    <div class="card is-shady" style="border-radius: 30px">
      <form action="">
        <div class="">
          <div class="" style="padding: 20px">
            <figure class="image is-1by1">
              <img
                class="is-rounded"
                alt="Placeholder image"
                :src="picture_route"
              />
            </figure>
          </div>
          <div class="file is-centered">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                accept="image/png, image/jpeg"
                @change="changePicture"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fa fa-upload" aria-hidden="true"></i>
                </span>
                <span class="file-label"> Subir Imagen </span>
              </span>
            </label>
          </div>
          <!--
          <div class="buttons has-addons is-centered mt-2">
            <input type="file" accept="image/png, image/jpeg" class="button" @change="changePicture">Subir Imagen
          </div>
          -->
        </div>
        <div style="padding: 10px">
          <div class="field">
            <label class="label">Nombre Completo</label>
            <div class="control">
              <input
                v-model="lawyer.name"
                class="input"
                type="text"
                placeholder="Inserte su nombre completo"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Especializaciones</label>
            <div class="control">
              <label
                v-for="specialization in possibleSpecializations"
                class="radio"
              >
                <input
                  v-model="lawyer.specializations"
                  type="checkbox"
                  :value="specialization"
                />
                {{ specialization }}
              </label>
            </div>
          </div>
          <div class="field">
            <label class="label">Descripcion</label>
            <div class="control">
              <textarea
                v-model="lawyer.description"
                class="textarea"
                placeholder="Agregue una descripcion breve..."
              ></textarea>
            </div>
          </div>
        </div>
        <!--
        <div class="card-content">
          <div class="content">
            <div class="media-content">
              <span class="is-4">Nombre Completo:</span>
              <input
                v-model="lawyer.name"
                class="input is-small"
                type="text"
                placeholder="Inserte su nombre"
              />
            </div>
          </div>
          <div class="content">
            <span class="icon-text">
              <span class="is-4">Especializaciones:</span>
              <label v-for="specialization in possibleSpecializations">
                <input
                  v-model="lawyer.specializations"
                  type="checkbox"
                  :value="specialization"
                />{{ specialization }}
              </label>
            </span>
            <br />
            <br />
            <span class="icon-text">
              <span>Descripcion:</span>
            </span>
            <div class="field">
              <div class="control">
                <textarea
                  v-model="lawyer.description"
                  class="textarea is-small"
                  placeholder="Inserte una descripcion breve"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        -->
        <div class="buttons has-addons is-centered">
          <input
            type="button"
            class="button is-rounded"
            value="Guardar"
            @click="editLawyer(lawyer)"
          />
          <NuxtLink class="button is-rounded" to="/profile">Cancelar</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
