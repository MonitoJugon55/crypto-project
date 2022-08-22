let datosTransacciones = null;
let url = 'https://crypto.develotion.com/';


if (localStorage.getItem('apikey')){
    initInversiones();
} else {
    location.href = 'iniciarSesion.html';
}

function initInversiones(){
    obtenerTransacciones();
    setTimeout(calcularInversiones, 1500);
}

function calcularInversiones(){
    let id = localStorage.getItem('id');
    let total = 0;
    for (let i in datosTransacciones.transacciones) {
        if (datosTransacciones.transacciones[i].usuarios_id == id) {
            if(datosTransacciones.transacciones[i].tipo_operacion == 1){
                total += (datosTransacciones.transacciones[i].valor_actual*datosTransacciones.transacciones[i].cantidad);
            }
            else if(datosTransacciones.transacciones[i].tipo_operacion == 2){
                total -= (datosTransacciones.transacciones[i].valor_actual*datosTransacciones.transacciones[i].cantidad);
            }
        }
    }
    let resultado = `<ion-content id="contentIniciarSesion">
    <ion-grid>
        <ion-card>
            <ion-card-content>
                <ion-item>
                    <ion-label>
                        Ganancias totales hasta la fecha: $${total}
                    </ion-label>
                </ion-item>
            </ion-card-content>
        </ion-card>
    </ion-grid>
</ion-content>`;
    document.querySelector('#ionApp').innerHTML += resultado;
}

function obtenerTransacciones() {
    let apikey = localStorage.getItem('apikey');
    let id = localStorage.getItem('id');

    fetch(`${url}transacciones.php?idUsuario=${id}`, {
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
            console.log(data)
            datosTransacciones = data;
        })
        .catch((err) => {
            console.log(err);
        })
}