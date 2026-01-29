const GUI = BABYLON.GUI;

export default class SistemaDialogos {
    constructor(scene) {
        this.scene = scene;
        this.dialogoActivo = false;
        
        // --- CONFIGURACIÓN RÁPIDA ---
        // Asocia el ID del personaje con el nombre de tu imagen en la carpeta assets
        this.cuadrosDialogo = {
            "Artorius": "dialogo_Artorius.png",
        };
        this.rutaAssets = "../../Assets/dialog/"; // Cambia esto a tu ruta real

        this.imagenesCaras = {
            "Artorius": "Artorius.png"
        };
        this.rutaPersonajes = "../../Assets/personajes/";
        
        // Estado interno
        this.colaDialogos = [];
        this.indiceActual = 0;
        this.intervaloEscritura = null;
        this.textoCompletoActual = "";
        
        // Inicializar UI
        this.crearInterfaz();
    }

    crearInterfaz() {
        // 1. Textura Base
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI_Dialogos");

        this.retrato = new GUI.Image("imgRetrato", ""); 
        this.retrato.width = "680px";   // Ajusta según tu imagen
        this.retrato.height = "850px";
        this.retrato.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.retrato.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.retrato.left = "50px";     // Un poco separado del borde izquierdo
        this.retrato.top = "0px";       // Pegado al fondo
        this.retrato.isVisible = false; // Oculto al inicio
        this.advancedTexture.addControl(this.retrato);

        // 2. Contenedor del Dialogo (El cuadro)
        this.contenedor = new GUI.Rectangle("ContenedorDialogo");
        this.contenedor.width = "1400px";
        this.contenedor.height = "800px";
        this.contenedor.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.contenedor.top = "-20px"; // Margen inferior
        this.contenedor.thickness = 0;
        this.contenedor.isVisible = false;
        this.advancedTexture.addControl(this.contenedor);

        // 3. Imagen de Fondo (La caja de diálogo)
        this.imagenFondo = new GUI.Image("ImgFondo", "");
        this.imagenFondo.stretch = GUI.Image.STRETCH_UNIFORM;
        this.contenedor.addControl(this.imagenFondo);

        // 4. Texto
        this.bloqueTexto = new GUI.TextBlock();
        this.bloqueTexto.text = "";
        this.bloqueTexto.color = "#F7D88E"; // O negro, según tu imagen
        this.bloqueTexto.fontFamily = "FuenteJuego";
        this.bloqueTexto.fontSize = 48;
        this.bloqueTexto.textWrapping = true;
        this.bloqueTexto.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.bloqueTexto.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        // Márgenes para que el texto no se salga de la caja (AJUSTA ESTO A TU DISEÑO)
        this.bloqueTexto.paddingLeft = "400px";  // Espacio para la cara del personaje si la tiene
        this.bloqueTexto.paddingRight = "190px";
        this.bloqueTexto.paddingTop = "100px";
        this.bloqueTexto.paddingBottom = "20px";
        
        this.contenedor.addControl(this.bloqueTexto);
    }

    iniciar(guion) {
        if (this.dialogoActivo) return; // Evitar solapamientos
        
        this.colaDialogos = guion;
        this.indiceActual = 0;
        this.dialogoActivo = true;
        this.contenedor.isVisible = true;

        this.mostrarLineaActual();
    }

    mostrarLineaActual() {
        // Verificar si terminamos
        if (this.indiceActual >= this.colaDialogos.length) {
            this.cerrar();
            return;
        }

        const linea = this.colaDialogos[this.indiceActual];

        this.textoCompletoActual = linea.texto.toUpperCase();

        const nombreArchivoCara = this.imagenesCaras[linea.personaje];

        if (nombreArchivoCara) {
            // 1. Asignamos la ruta
            this.retrato.source = this.rutaPersonajes + nombreArchivoCara;
            
            // 2. ¡EL PASO QUE FALTABA! Hacemos visible la imagen
            this.retrato.isVisible = true; 
        } else {
            // 3. Si no hay cara (ej. Narrador), ocultamos el retrato anterior
            this.retrato.isVisible = false;
        }
        
        // 1. Cambiar Imagen
        const nombreImagen = this.cuadrosDialogo[linea.personaje] || this.cuadrosDialogo["default"];
        this.imagenFondo.source = this.rutaAssets + nombreImagen;

        // 2. Preparar Texto (Efecto Máquina de Escribir)
        this.bloqueTexto.text = ""
        let charIndex = 0;

        // Limpiar intervalo anterior si existía
        if (this.intervaloEscritura) clearInterval(this.intervaloEscritura);

        this.intervaloEscritura = setInterval(() => {
            this.bloqueTexto.text += this.textoCompletoActual[charIndex];
            charIndex++;

            if (charIndex >= this.textoCompletoActual.length) {
                clearInterval(this.intervaloEscritura);
                this.intervaloEscritura = null;
            }
        }, 30); // Velocidad: 30ms por letra
    }

    siguiente() {
        // Lógica: Si está escribiendo, terminar de golpe. Si ya terminó, pasar al siguiente.
        if (this.intervaloEscritura) {
            // Completar texto inmediatamente
            clearInterval(this.intervaloEscritura);
            this.intervaloEscritura = null;
            this.bloqueTexto.text = this.textoCompletoActual;
        } else {
            // Avanzar al siguiente diálogo
            this.indiceActual++;
            this.mostrarLineaActual();
        }
    }

    cerrar() {
        this.contenedor.isVisible = false;
        this.retrato.isVisible=false
        this.dialogoActivo = false;
        this.bloqueTexto.text = "";
        // Opcional: Emitir evento para reactivar movimiento del jugador
    }
}