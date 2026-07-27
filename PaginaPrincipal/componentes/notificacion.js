const div = document.querySelector('#notificacion');

export const createNotificacion = (isError, message) => {
    div.classList.add('fixed', 'top-20', 'right-0', 'left-0');

    if(isError){
    div.innerHTML = `
    <div class="fixed top-20 right-0 left-0">
    <div class="max-w-7xl mx-auto px-4 flex justify-end">
    <p class="bg-red-500 p-4 w-3/12 rounded-lg font-bold">${message}</p>
    </div>
    </div>`;
    }else{
    div.innerHTML = `
    <div class="fixed top-20 right-0 left-0">
    <div class="max-w-7xl mx-auto px-4 flex justify-end">
    <p class="bg-green-500 p-4 w-3/12 rounded-lg font-bold">${message}</p>
    </div>
    </div>`;
    }
   
}