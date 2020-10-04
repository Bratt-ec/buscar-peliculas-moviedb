// selectores
const formulario = document.querySelector('#formulario'),
       btnBuscar = document.querySelector('#buscar-pelicula'),
       divResultado = document.querySelector('#resultado'),
       paginacionDiv = document.querySelector('#paginacion');

// variables
const registrosPorPagina = 20;
let totalPaginas;
let iterador;
let paginaActual = 1;


// eventos
document.addEventListener('DOMContentLoaded', () =>{
    formulario.addEventListener('submit', validarFormulario);
});

// funciones
function validarFormulario(e){
    e.preventDefault();
    const txtPelicula = document.querySelector('#txtPelicula').value;
    
    if(txtPelicula === ''){
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarPelicula();
}
// mostrar alerta
function mostrarAlerta(mensaje){
    const existAlert = document.querySelector('.alert-danger');
    if(!existAlert){
        const alerta = document.createElement('p');
        alerta.innerHTML= `
            <div class="alert alert-danger" role="alert">
            !Error: ${mensaje}
            </div>
        `;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2500);
    }
}
// buscar pelicula
async function buscarPelicula(){
    const  txtPelicula = document.querySelector('#txtPelicula').value;
    // key
    const key = 'get your key in www.themoviedb.org';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=es-ES&query=${txtPelicula}&page=${paginaActual}&include_adult=false`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        // si no hay resultados de busqueda imprime mensaje
        if(datos.total_results === 0){
            mostrarAlerta('No se ha encontrado, intente otra busqueda');
        }
        totalPaginas = calcularPaginas(datos.total_results);
        mostrarPeliculas(datos.results);    
    } catch (error) {
        console.log(error);
    }
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for (let i = 1; i <= total; i++ ) {
        yield i;
    }
}
// calcular registros por página
function calcularPaginas(total) {
    return parseInt( Math.ceil( total / registrosPorPagina ));
}
// mostrar peliculas
function mostrarPeliculas(peliculas){

    // removemos algun resultado previo
    while (divResultado.firstChild) {
        divResultado.removeChild(divResultado.firstChild);
    }
    // 
    peliculas.forEach( pelicula =>{
        const imgUrl = 'http://image.tmdb.org/t/p/w300_and_h450_bestv2/';
        const {title,overview,release_date,vote_average,poster_path,} = pelicula;

        divResultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${imgUrl + poster_path}" alt="Poster de la Película" >

                <div class="p-3">
                    <p class="font-bold h4"> ${title}</p>
                    <p class="font-bold">Fecha de estreno: <span class="font-light"> ${release_date} </span> </p>
                    <p class="font-bold">Puntuación: <span class="font-light"> ${vote_average}/10 </span> </p>
                </div>
            </div>
        </div>
        `;
    });
    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    // Generamos el nuevo HTML
    imprimirPaginador();
    
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while(true) {
        const { value, done} = iterador.next();
        if(done) return;

        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarPelicula();
        }

        paginacionDiv.appendChild(boton);
    }
}
