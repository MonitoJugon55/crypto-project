let url = 'https://crypto.develotion.com/';
let map = L.map('map').setView([-32.90, -56.18], 6);
let datosUserXDep = null;
let datosDepartamentos = null;
let circuloDin = new Array(19);


if (localStorage.getItem('apikey')) {
    initMapa();
} else {
    location.href = 'iniciarSesion.html';
}

function initMapa() {
    obtenerDepartamentos();
    obtenerUsuariosDepartamentos();
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 8,
        minZoom: 6
    }).addTo(map);
    setTimeout(marcarMapa, 1000);
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
            circuloDin[i].setRadius(15000);
        }
    }
}












