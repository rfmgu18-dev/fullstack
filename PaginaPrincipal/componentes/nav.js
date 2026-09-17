const navbar = document.querySelector("#navbar");

const createNavHome = () => {
  navbar.innerHTML = `<div class="max-w-7xl bg-indigo-700 h-17 mx-auto flex items-center px-4 justify-between">
        <p class="font-bold text-xl text-white">TodoApp</p>

        <!-- Version Movil -->
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 md:hidden text-white cursor-pointer hover:bg-indigo-800 rounded-lg">
           <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
           </svg>

        <!-- Version Escritorio -->
           <div class="hidden md:flex flex-row gap-4">
            <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-400 py-2 px-4 rounded-lg">Login</a>
            <a href="/registro/" class="transition ease-in-out text-white font-bold bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-lg">Registro</a>
          </div>

        <!-- Menu Desplegable -->
          <div class="bg-slate-900/80 fixed top-16 right-0 left-0 bottom-0 justify-center items-center flex-col gap-4 hidden">
            <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-400 py-2 px-4 rounded-lg">Login</a>
            <a href="/registro/" class="transition ease-in-out text-white font-bold bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-lg">Registro</a>
         </div>
      </div>`;
};

const createNavRegistro = () => {
  navbar.innerHTML = `<div class="max-w-7xl bg-indigo-700 h-17 mx-auto flex items-center px-4 justify-between">
        <p class="font-bold text-xl text-white">TodoApp</p>

        <!-- Version Movil -->
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 md:hidden text-white cursor-pointer hover:bg-indigo-800 rounded-lg">
           <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
           </svg>

        <!-- Version Escritorio -->
           <div class="hidden md:flex flex-row gap-4">
            <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-400 py-2 px-4 rounded-lg">Login</a>
          </div>

        <!-- Menu Desplegable -->
          <div class="bg-slate-900/80 fixed top-16 right-0 left-0 bottom-0 justify-center items-center flex-col gap-4 hidden">
            <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-indigo-400 py-2 px-4 rounded-lg">Login</a>
         </div>
      </div>`;
};


if(window.location.pathname === '/'){
    createNavHome();
}else if (window.location.pathname === '/registro/'){
  createNavRegistro();
}else if (window.location.pathname === '/login/'){
  createNavRegistro();
}


const btnNavbar = navbar.children[0].children[1];



btnNavbar.addEventListener('click', evento =>{
    const menuDesplegable = navbar.children[0].children[3];
    if(!btnNavbar.classList.contains('active')){
        btnNavbar.classList.add('active');
         btnNavbar.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`;
         menuDesplegable.classList.remove('hidden');
         menuDesplegable.classList.add('flex');
    }else{
        btnNavbar.classList.remove('active');
        btnNavbar.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
        menuDesplegable.classList.add('hidden');
        menuDesplegable.classList.remove('flex');
    }
   
});
