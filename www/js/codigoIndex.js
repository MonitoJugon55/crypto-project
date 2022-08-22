let url = 'https://crypto.develotion.com/';
let urlimg = 'https://crypto.develotion.com/imgs/';
const btnIniciarSesion = document.querySelector('#btnIniciarSesion');
const btnRegistrarse = document.querySelector('#btnRegistrarse');



init()

function init() {   
    loginAuto();
}



function loginAuto(){
    let usuario = localStorage.getItem('user');
    let pass = localStorage.getItem('pass');
    let apikey = localStorage.getItem('apikey');
    if(usuario !== null && pass !== null && apikey !== null){
        let loginUser = new Object;
        loginUser.usuario = usuario;
        loginUser.password = pass;
        fetch(`${url}login.php`,{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(loginUser)
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(!data.mensaje){
                localStorage.setItem('user',usuario);
                localStorage.setItem('pass',pass);
                localStorage.setItem('apikey',data.apiKey);
                location.href = 'Inicio.html';
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
}










