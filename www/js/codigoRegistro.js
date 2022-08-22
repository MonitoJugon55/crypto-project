let url = 'https://crypto.develotion.com/';
let urlimg = 'https://crypto.develotion.com/imgs/';
const btnCompReg = document.querySelector('#btnCompletarRegistro');
let datosDepartamentos = null;
let datosCiudades = null;
const ROUTER = document.querySelector("#rutaRegistrar");
initRegistro();

function initRegistro() {
    obtenerCiudades();
    obtenerDepartamentos();
    btnCompReg.addEventListener('click', () => {
        registrarUsuario();
    });
}


function registrarUsuario() {
    let usuario = document.querySelector('#usuarioRegistro').value;
    let contraseña = document.querySelector('#contraseñaRegistro').value;
    let departamento = document.querySelector('#departamentoRegistro').value;
    let ciudad = document.querySelector('#ciudadRegistro').value;

    if (validarDatos(ciudad, departamento)) {
        let newUser = new Object();
        newUser.usuario = usuario;
        newUser.password = contraseña;
        newUser.idDepartamento = departamento;
        newUser.idCiudad = ciudad;

        fetch(`${url}usuarios.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then((response) => {
                console.log(response.status);
                return response.json();
            })
            .then((data) => {
                if (data.mensaje) {
                    document.querySelector('#mensajeRegistro').innerHTML = data.mensaje;
                }else{
                    location.href="iniciarSesion.html" 
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }else{
        document.querySelector('#mensajeRegistro').innerHTML = 'Ingrese datos de ciudad y departamento validos';
    }

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

function validarDatos(ciudad, departamento) {
    let dep = null;
    let city = null;
    for (let i in datosDepartamentos.departamentos) {
        if (datosDepartamentos.departamentos[i].id == departamento) {
            dep = datosDepartamentos.departamentos[i].id;
        }
    }
    for (let i in datosCiudades.ciudades) {
        if (datosCiudades.ciudades[i].id == ciudad) {
            city = datosCiudades.ciudades[i].id_departamento;
        }
    }
    if (city == dep && dep !== null) {
        console.log('Pasa')
        return true;
    } else {
        console.log('no Pasa')
        return false;
    }
}



