//conexion al backend con fetch y promesas
//la URL base de nuestro backend express
const API_URL = "http://localhost:3000/api/products";

//capturamos los elementos del DOM (HTML) usando sus IDS
//digamos que vamos por las cosas del html y las hacemos aqui una variable para poder utilizarlas
const contenedorProductos = document.getElementById("contenedorProductos");
const formProducto = document.getElementById("formProducto");
const mensajeEstado = document.getElementById("mensajeEstado");
const btnCargar = document.getElementById("btnCargar");

//funcion par consultar y dibujar productos (GET)

async function cargarProductos(){
    contenedorProductos.innerHTML = '<p class = "loading-txt">Cargando datos desde el servidor Express...</p>';
    try{
        //A) peticion GET con fetch() (devuelve una promesa)
        const respuesta = await fetch(API_URL); //espera la respuesta de la url
        if(!respuesta.ok){
            throw new Error("Error en la respuesta del servidor");
        }
        //B) convertirmos la respuesta de JSON a objeto de JS (devuelve otra promesa)
        const productos = await respuesta.json();
        if(productos.length === 0){
            contenedorProductos.innerHTML = '<p>No hay productos registrados en el servidor. </p>';
            return;
        }
        // C) transformamos arreglo de productos en tarjetas dinamicas HTML (.map)
        contenedorProductos.innerHTML = productos.map(p => `
            <div class= "producto-card">
            <div>
            <span class="prod-id">#${p.id}</span>
            <h3>${p.nombre}</h3>
            </div>
            <p class="prod-precio">$${Number(p.precio).toFixed(2)} MXN</p>
            </div>
            `).join('');
    }catch(error){
        //D) si el servidor esta apagado o fallo la conexion
        contenedorProductos.innerHTML = `
        <div class ="error-box">
        No se pudo conectar al servidor Express en <code>http://localhost:3000</code>
        <br><small>Asegurate de ejecutar <code>npm run dev</code> en la consola del Backend. </small>
        </div>
        `;
    }
}

//funcion para escuchar el envio del formulario para guardar un producto (POST)
formProducto.addEventListener('submit', async (e) =>{
    //evitamos que el navegador recarge la pagina automaticamente al enviar un formulario
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;

    try{
        //peticion POST enviando los datos en el body como JSON
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre,precio})
        });
        if(!respuesta.ok){
            throw new Error('Error al guardar el producto');
        }
        const resultado = await respuesta.json();
        //mostramos mensaje de exito en pantalla
        mensajeEstado.innerHTML= `<span class="success"> ${resultado.mensaje}</span>`;
        //limpiamos las cajas del formulario y recargamos la lista de productos
        formProducto.reset();
        cargarProductos();
        //borramos el mensaje de exito despues de 3 segundos
        setTimeout(() => mensajeEstado.innerHTML = '',3000);
    }catch(error){
        mensajeEstado.innerHTML = ` <span class="error"> Error al guardar producto </span>`;
    }
});

//evento del boton recargar y carga inicial
btnCargar.addEventListener('click', cargarProductos);
//cargamos automaticamente los productos al abrir la pagina
cargarProductos();
