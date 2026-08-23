// configuracion de axios general
axios.defaults.withCredentials = true;

// Selección de elementos
const input = document.querySelector('input[name="new-todo"]'); // Más específico
const ul = document.querySelector("ul");
const invalidCheck = document.querySelector(".invalid-check");
const form = document.querySelector("#form");
const totalCountSpan = document.querySelector(".total-count");
const completedCountSpan = document.querySelector(".completed-count");
const incompletedCountSpan = document.querySelector(".incompleted-count");

// Función única para crear el HTML de la tarea
const createTodoItem = (todo) => {
  const li = document.createElement("li");
  li.id = todo.id;
  li.className = `flex flex-row transition-all ${todo.checked ? "line-through text-slate-400 dark:text-slate-600" : ""}`;

  const checkBtnClass = todo.checked ? "bg-green-400" : "hover:bg-green-300";

  li.innerHTML = `
        <div class="group grow flex flex-row justify-between">
            <button class="delete-icon hide-btn w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <p class="p-4 break-words grow">${todo.text}</p>
        </div>
        <button class="check-icon w-12 md:w-14 flex justify-center items-center cursor-pointer border-l border-slate-300 dark:border-slate-400 ${checkBtnClass} transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </button>
    `;
  return li;
};

// Funciones de conteo mejoradas
const updateCounts = () => {
  const all = ul.children.length;
  const completed = ul.querySelectorAll(".line-through").length;

  totalCountSpan.textContent = all;
  completedCountSpan.textContent = completed;
  incompletedCountSpan.textContent = all - completed;
};

// Evento Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.classList.add("ring-2", "ring-rose-600");
    invalidCheck.classList.remove("hidden");
    return;
  }

  try {
    const { data } = await axios.post("/api/todos", { text }, {withCredentials: true});
    ul.append(createTodoItem(data));
    input.value = "";
    input.classList.remove("ring-2", "ring-rose-600");
    invalidCheck.classList.add("hidden");
    updateCounts();
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("No se pudo guardar la tarea.");
  }
});

// Evento Click (Delegación)
ul.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".delete-icon");
  const checkBtn = e.target.closest(".check-icon");

  if (deleteBtn) {
    const li = deleteBtn.closest("li");
    try {
      await axios.delete(`/api/todos/${li.id}`);
      li.remove();
      updateCounts();
    } catch (err) {
      console.error(err);
    }
  }

  if (checkBtn) {
    const li = checkBtn.closest("li");
    const isChecked = li.classList.contains("line-through");

    try {
      await axios.patch(`/api/todos/${li.id}`, { checked: !isChecked });
      li.classList.toggle("line-through");
      li.classList.toggle("text-slate-400");
      li.classList.toggle("dark:text-slate-600");
      checkBtn.classList.toggle("bg-green-400");
      checkBtn.classList.toggle("hover:bg-green-300");
      updateCounts();
    } catch (err) {
      console.error(err);
    }
  }
});

// Carga inicial
(async () => {
  try {
    const { data } = await axios.get("/api/todos");
    data.forEach((todo) => ul.append(createTodoItem(todo)));
    updateCounts();
  } catch (error) {
    // if (error.response?.status === 401) window.location.pathname = '/login';
  }
})();
