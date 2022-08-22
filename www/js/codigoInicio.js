const btnMostrarMonedas = document.querySelector('#btnMostrarMonedas');
const btnOcultarMonedas = document.querySelector('#btnOcultarMonedas');
const itemMostrarMonedas = document.querySelector('#itemMostrarMonedas');
const btnAgregarTransaccion = document.querySelector('#btnAgregarTransaccion');
const selectTabla = document.querySelector('#selectMonedas2');
const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
let map = L.map('map').setView([-32.90, -56.18], 6);
let url = 'https://crypto.develotion.com/';
let urlimg = 'https://crypto.develotion.com/imgs/';
let datosUserXDep = null;
let datosMonedas = null;
let datosDepartamentos = null;
let datosCiudades = null;
let datosTransacciones = null;
let apikeyStorage = localStorage.getItem('apikey');
let idStorage = localStorage.getItem('id');
let userStorage = localStorage.getItem('user');
let passStorage = localStorage.getItem('pass');
let circuloDin = new Array(19);

if (apikeyStorage){
    initInicio();
} else {
    location.href = 'iniciarSesion.html';
}


function initInicio() {
    obtenerUsuariosDepartamentos();
    obtenerMonedas();
    obtenerTransacciones();
    obtenerDepartamentos();
    obtenerCiudades();
    setTimeout(agregarMonedasSelect, 1500);
    setTimeout(listarTransacciones, 1000);
    setTimeout(marcarMapa, 1000);
    
    btnMostrarMonedas.addEventListener('click', () => {
        listarMonedas();
        itemMostrarMonedas.style.display = 'none';
        btnOcultarMonedas.style.display = 'block';
    });
    btnAgregarTransaccion.addEventListener('click', () => {
        agregarTransaccion();
    });
    selectTabla.addEventListener('ionChange', function () {
        listarTransacciones();
    });
    btnCerrarSesion.addEventListener('click', () => {
        cerrarSesion();
    });
    btnOcultarMonedas.addEventListener('click', () => {
        btnOcultarMonedas.style.display = 'none';
        itemMostrarMonedas.style.display = 'block';
        document.querySelector('#tablaMonedas').innerHTML = '';
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 6
    }).addTo(map);
    

}

function listarMonedas() {
    let tabla = `<thead><tr><td align="center">Imagen</td><td align="center">Nombre</td><td align="center">Valor</td></tr></thead><tbody>`;
    for (let i in datosMonedas.monedas) {
        tabla += `<tr><td align="center"><img src='${urlimg + datosMonedas.monedas[i].imagen}'></td><td align="center">${datosMonedas.monedas[i].nombre}</td><td align="center">${datosMonedas.monedas[i].cotizacion}</td></tr>`;
    }
    tabla += `</tbody>`;
    document.querySelector('#tablaMonedas').innerHTML += tabla;
}

function obtenerUsuariosDepartamentos() {
    let apikey = localStorage.getItem('apikey');

    fetch(`${url}usuariosPorDepartamento.php`, {
        method: 'GET',
        headers: {
            'apikey': apikey,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            datosUserXDep = data;
        })
        .catch((err) => {
            console.log(err);
        })
}


function obtenerMonedas() {
    fetch(`${url}monedas.php`, {
        method: 'GET',
        headers: {
            'apikey': apikeyStorage,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            datosMonedas = data;
        })
        .catch((err) => {
            console.log(err);
        })
}

function obtenerDepartamentos() {
    fetch(`${url}departamentos.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            datosDepartamentos = data;
        })
        .catch((err) => {
            console.log(err)
        });

}

function obtenerCiudades() {
    fetch(`${url}ciudades.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            datosCiudades = data;
        })
        .catch((err) => {
            console.log(err);
        })
}

function obtenerTransacciones() {
    fetch(`${url}transacciones.php?idUsuario=${idStorage}`, {
        method: 'GET',
        headers: {
            'apikey': apikeyStorage,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            datosTransacciones = data;
        })
        .catch((err) => {
            console.log(err);
        })
}

function agregarMonedasSelect() {
    let select = ``;
    for (let i in datosMonedas.monedas) {
        select += `<ion-select-option value='${datosMonedas.monedas[i].id}'>${datosMonedas.monedas[i].nombre} - $${datosMonedas.monedas[i].cotizacion}</ion-select-option>`;
    }
    document.querySelector('#selectMonedas').innerHTML += select;
    document.querySelector('#selectMonedas2').innerHTML += select;
}

function agregarTransaccion() {
    let tipoOp = null;
    let moneda = document.querySelector('#selectMonedas').value;
    let cant = document.querySelector('#cantTransaccion').value;
    let valor = 0;

    if (document.querySelector('#radioBtn').value == 1) {
        tipoOp = 1;
    } else if (document.querySelector('#radioBtn').value == 2) {
        tipoOp = 2;
    }
    //Control de eleccion de operacion
    else if (tipoOp == null) {
        document.querySelector('#mensajeTransaccion').innerHTML = 'Seleccione un tipo de operacion';
        return false;
    }
    //Controla que ingrese una cantidad
    if (cant == 0 || cant == null) {
        document.querySelector('#mensajeTransaccion').innerHTML = 'Ingrese una cantidad';
        return false;
    }
    //Controla que seleccione una moneda
    if (moneda == undefined) {
        document.querySelector('#mensajeTransaccion').innerHTML = 'Seleccione una moneda';
        return false;
    }

    //Busca el valor de la moneda seleccionada en datosMonedas.
    for (let i in datosMonedas.monedas) {
        if (moneda == datosMonedas.monedas[i].id) {
            valor = datosMonedas.monedas[i].cotizacion;
        }
    }
    document.querySelector('#radioBtn').value = null;
    document.querySelector('#cantTransaccion').value = null;
    document.querySelector('#selectMonedas').value = null;
    let newUser = new Object;
    newUser.idUsuario = idStorage;
    newUser.tipoOperacion = tipoOp;
    newUser.moneda = moneda;
    newUser.cantidad = cant;
    newUser.valorActual = valor;

    fetch(`${url}transacciones.php`, {
        method: 'POST',
        headers: {
            'apikey': apikeyStorage,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            obtenerTransacciones();
            document.querySelector('#mensajeTransaccion').innerHTML = data.mensaje;
            setTimeout(listarTransacciones, 1500);

        })
        .catch((err) => {
            console.log(err);
        });
}

function listarTransacciones() {
    let table = `<thead>
    <tr>
        <td align="center">Moneda</td>
        <td align="center">Tipo de operacion</td>
        <td align="center">Cantidad</td>
        <td align="center">Valor de la moneda</td>
    </tr>
</thead><tbody><tr><td>`;

    if (selectTabla.value !== undefined && selectTabla.value!=='monedas') {
        for (let i in datosTransacciones.transacciones) {
            if (datosTransacciones.transacciones[i].usuarios_id == idStorage && selectTabla.value == datosTransacciones.transacciones[i].moneda) {
                table += `<tr><td align="center">${datosTransacciones.transacciones[i].moneda}</td><td align="center">${datosTransacciones.transacciones[i].tipo_operacion}</td>
                <td align="center">${datosTransacciones.transacciones[i].cantidad}</td><td align="center">${datosTransacciones.transacciones[i].valor_actual}</td></tr>`;
            }
        }
        table += `</tbody>`;
        document.querySelector("#listaTransacciones").innerHTML = table;
    } else {
        for (let i in datosTransacciones.transacciones) {
            if (datosTransacciones.transacciones[i].usuarios_id == idStorage) {
                table += `<tr><td align="center">${datosTransacciones.transacciones[i].moneda}</td><td align="center">${datosTransacciones.transacciones[i].tipo_operacion}</td>
                <td align="center">${datosTransacciones.transacciones[i].cantidad}</td><td align="center">${datosTransacciones.transacciones[i].valor_actual}</td></tr>`;
            }
        }
        table += `</tbody>`;
        document.querySelector("#listaTransacciones").innerHTML = table;
    }

}

function marcarMapa() {

    for (let i in datosDepartamentos.departamentos) {
        circuloDin[i] = L.circle([datosDepartamentos.departamentos[i].latitud, datosDepartamentos.departamentos[i].longitud], {
            color: '#aaa',
            fillOpacity: 0,
            radius: 15000
        });
        circuloDin[i].on('click', () => {
            clickCirculo(circuloDin[i]);
        });
        for (let n in datosUserXDep.departamentos) {
            if (datosUserXDep.departamentos[n].nombre == datosDepartamentos.departamentos[i].nombre) {
                circuloDin[i].bindPopup(`Cantidad de usuarios en ${datosDepartamentos.departamentos[i].nombre}: ${datosUserXDep.departamentos[n].cantidad_de_usuarios}`).addTo(map);
            }
        }
    }
}

function clickCirculo(circulo) {
    
    if (circulo.getRadius() >= 10000 && circulo.getRadius() < 50000) {
        circulo.setRadius(50000);
        
    } else if (circulo.getRadius() == 50000) {
        circulo.setRadius(15000);
    }
    for(let i in circuloDin){
        if(circuloDin[i].getRadius() == 50000 && circuloDin[i] !== circulo){
            console.log('asdasda')
            circuloDin[i].setRadius(15000);
        }
    }
}


function cerrarSesion() {
    localStorage.clear();
    location.href = 'index.html';
}

