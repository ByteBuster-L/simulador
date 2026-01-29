export default class GameManager {
    constructor() {
        this.consumoLuz = 0; // kW
        this.consumoAgua = 0; // Litros
        this.costoTotal = 0; // Dinero
        
        // Listas de qué cosas están prendidas
        this.lucesActivas = [];
        this.grifosActivos = [];

        // Precios
        this.precioLuz = 0.5; 
        this.precioAgua = 0.2; 

        //Refrigerador
        this.consumoRefri = 0.6; // kW por segundo (gasta constante)
        this.calculoRefri = this.consumoRefri * 0.7
        this.costoRefri = this.calculoRefri;

        // Tiempo de juego
        this.tiempoRestante = 180; // 3 Minutos (en segundos)
        this.juegoActivo = true; // Interruptor general
        
        // Arrancar el reloj al nacer
        this.iniciarReloj();
    }

    // Este es el corazón que late cada segundo
    iniciarReloj() {
        this.intervaloID = setInterval(() => {
            if (this.juegoActivo) {
                this.cicloDeJuego();
            }
        }, 1000); 
    }

    // Funciones para que los muebles avisen
    registrarLuz(luz) {
        if (luz.encendida) this.lucesActivas.push(luz);
        else this.lucesActivas = this.lucesActivas.filter(l => l !== luz);
    }

    registrarGrifo(grifo) {
        if (grifo.abierto) this.grifosActivos.push(grifo);
        else this.grifosActivos = this.grifosActivos.filter(g => g !== grifo);
    }

    // Lo que pasa cada segundo
    cicloDeJuego() {
        // 1. Cobrar (Si hay cosas prendidas)
        if (this.lucesActivas.length > 0) {
            this.consumoLuz += (this.lucesActivas.length * 0.1); 
            this.costoTotal += (this.lucesActivas.length * this.precioLuz);
        }
        if (this.grifosActivos.length > 0) {
            this.consumoAgua += (this.grifosActivos.length * 1.5);
            this.costoTotal += (this.grifosActivos.length * this.precioAgua);
        }

        this.consumoLuz += this.consumoRefri;
        this.costoTotal += this.costoRefri;

        // 2. Restar tiempo
        this.tiempoRestante--;

        // 3. Actualizar el relojito en pantalla
        this.actualizarRelojVisual();

        // 4. ¿Se acabó el tiempo?
        if (this.tiempoRestante <= 0) {
            this.terminarJuego();
        }
    }

    // Poner bonito el tiempo (03:00)
    actualizarRelojVisual() {
        const minutos = Math.floor(this.tiempoRestante / 60);
        const segundos = this.tiempoRestante % 60;
        const texto = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        const relojElement = document.getElementById("reloj-juego");
        if(relojElement) relojElement.innerText = texto;
    }

    // ¡FIN DEL JUEGO!
    terminarJuego() {
        this.juegoActivo = false;
        clearInterval(this.intervaloID); // Matar el reloj
        
        console.log("¡Fin del día!");

        // 1. Escribir los datos en la factura final
        const txtLuz = document.getElementById("info-luz");
        const txtAgua = document.getElementById("info-agua");
        const txtDinero = document.getElementById("info-dinero");

        if(txtLuz) txtLuz.innerText = this.consumoLuz.toFixed(2) + " kW";
        if(txtAgua) txtAgua.innerText = this.consumoAgua.toFixed(1) + " L";
        if(txtDinero) txtDinero.innerText = "$ " + this.costoTotal.toFixed(2);

        // 2. MOSTRAR EL CUADRO BLANCO
        const factura = document.getElementById("factura-modal");
        if(factura) factura.style.display = "block";
    }
}