<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <span class="navbar-burger burger" data-target="navbarMenu">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenu" class="navbar-menu">
        <div class="navbar-end">
          <span class="navbar-item">
            <NuxtLink class="button is-black is-outlined" to="/lawyers">
              <span class="icon">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span>Volver</span>
            </NuxtLink>
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>
