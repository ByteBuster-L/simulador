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
    }

    crearCamaraPrimeraPersona() {
        const camara = new BABYLON.UniversalCamera("camaraJugador", new BABYLON.Vector3(10, 7, 0), this.scene);

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

        // Evitar recortes visuales
        camara.minZ = 0.1;

        this.camera = camara;
    }

    intentarInteractuar() {
        const ray = this.camera.getForwardRay(4); // Rayo de 3 metros
        const hit = this.scene.pickWithRay(ray);

        if (hit.hit && hit.pickedMesh) {
            console.log("Golpeé a: " + hit.pickedMesh.name);
            if (hit.pickedMesh.metadata && hit.pickedMesh.metadata.interactable) {
                hit.pickedMesh.metadata.interactable.interactuar();
            }
        }
    }
}