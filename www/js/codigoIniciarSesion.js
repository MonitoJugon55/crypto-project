let url = 'https://crypto.develotion.com/';
let urlimg = 'https://crypto.develotion.com/imgs/';
const btnInicioSesion = document.querySelector('#btnInicioSesion');


initIniciarSesion();

function initIniciarSesion() {
    btnInicioSesion.addEventListener('click', loginUsuario);

}


function loginUsuario() {
    let usuario = document.querySelector('#usuarioLogin').value;
    let pass = document.querySelector('#contraseñaLogin').value;
    let loginUser = new Object;

    loginUser.usuario = usuario;
    loginUser.password = pass;

    fetch(`${url}login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginUser)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            if (data.mensaje) {
                document.querySelector('#mensajeLogin').innerHTML = data.mensaje;
            } else {
                localStorage.setItem('user', usuario);
                localStorage.setItem('pass', pass);
                localStorage.setItem('apikey', data.apiKey);
                localStorage.setItem('id', data.id);
                location.href = 'Inicio.html';
            }
        })
        .catch((err) => {
            console.log(err);
        })

}

















