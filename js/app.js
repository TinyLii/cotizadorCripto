const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const criptoSelect = document.querySelector("#criptomonedas");
const moneda = document.querySelector("#moneda")
const objBusqueda = {
    moneda : "",
    criptomoneda : ""
}


//crear Promise
const obtenerCripto = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas)
})

document.addEventListener("DOMContentLoaded", ()=>{
    consultarCripto();

    formulario.addEventListener("submit",submitFormulario);
    criptoSelect.addEventListener("change",leerValor)
    moneda.addEventListener("change",leerValor)
})



async function consultarCripto(){
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado=>obtenerCripto(resultado.Data))
    //     .then(criptomonedas => selectCripto(criptomonedas))

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCripto(resultado.Data);
        selectCripto(criptomonedas);
    } catch (error) {
        console.log(error)
    }
}

function selectCripto(criptomonedas){
    criptomonedas.forEach(cripto=>{
        const { FullName, Name} = cripto.CoinInfo;

        const option = document.createElement("option")
        option.value = Name;
        option.textContent = FullName;

        criptoSelect.appendChild(option)
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
    
}

function submitFormulario(e){
    e.preventDefault();

    const {moneda,criptomoneda} = objBusqueda;
    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta("Ambos campos son obligatorios")
        return;
    }
    
    consultarAPI();

}

function mostrarAlerta(mensaje){

    const existeError = document.querySelector(".error");

    if(!existeError){
        const divMensaje = document.createElement("div");
        divMensaje.textContent = mensaje;
        divMensaje.classList.add("error");
        formulario.appendChild(divMensaje)

        setTimeout(()=>{
            divMensaje.remove()
        },2500) 
    }

}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    // fetch(url)
    //     .then(respuesta=>respuesta.json())
    //     .then(cotizacion=>{
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    //     })

    try {
        const respuesta = await fetch(url)
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    } catch (error) {
        console.log(error)
    }
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML()

    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;

    const precio = document.createElement("p");
    precio.classList.add("precio")
    precio.innerHTML = `El precio es <span> ${PRICE} </span>`

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `Precio más alto del día <span> ${HIGHDAY}</span>`

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `Precio más bajo del día <span> ${LOWDAY}</span>`

    const ultimoDia = document.createElement("p");
    ultimoDia.innerHTML = `Variación en el último día <span> ${CHANGEPCT24HOUR}%</span>`

    const lastUpdate = document.createElement("p");
    lastUpdate.innerHTML = `Última actualización <span> ${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimoDia)
    resultado.appendChild(lastUpdate)
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `
    resultado.appendChild(spinner)
}