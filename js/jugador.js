export default class Jugador {
    constructor(scene, canvas, GameManager) {
        this.scene = scene;
        this.canvas = canvas;
        this.GameManager = GameManager

        // 1. Crear la cámara
        this.crearCamaraPrimeraPersona();

        // 2. Configurar el "Rayo" para interactuar (lo que hicimos antes)
        this.scene.registerBeforeRender(() => {
            // Aquí podrías llamar a tu función de detectar si la necesitas
            // this.detectarObjeto(); 
        });

        this.scene.onPointerDown = (evt) => {
            if (evt.button === 0) this.intentarInteractuar();
        };

        window.addEventListener("keydown", (evt) => {
            const letra = evt.key;
            if(letra == "e" || letra == "E"){
                this.intentarInteractuar();
            }
        })
    }

    crearCamaraPrimeraPersona() {
        const camara = new BABYLON.UniversalCamera("camaraJugador", new BABYLON.Vector3(10, 4, 0), this.scene);

        camara.attachControl(this.canvas, true);
        camara.speed = 3.0;
        camara.angularSensibility = 1000; 
        
        camara.inertia = 0.1;

        // --- TECLAS WASD ---
        camara.keysUp = [87];    // W
        camara.keysDown = [83];  // S
        camara.keysLeft = [65];  // A
        camara.keysRight = [68]; // D

        // fisica
        camara.checkCollisions = true; 
        camara.applyGravity = true;    

        camara.ellipsoid = new BABYLON.Vector3(1, 2.5, 1); 
        camara.ellipsoidOffset = new BABYLON.Vector3(0, -1.5, 1)

        // Evitar recortes visuales
        camara.minZ = 0.1;

        this.canvas.addEventListener("click", () => {
            this.canvas.requestPointerLock();
        })

        this.camera = camara;
    }

    intentarInteractuar() {
        this.departamento.interactuables.forEach(objeto => {
            const distancia = BABYLON.Vector3.Distance(this.camera.position, objeto.mesh.position)
            if(distancia <= 5){
                objeto.interactuar()
            }
        });
    }
}