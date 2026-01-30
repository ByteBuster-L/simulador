const GUI = BABYLON.GUI;

export default class SistemaDialogos {
    constructor(scene) {
        this.scene = scene;
        this.dialogoActivo = false;
        
        this.cuadrosDialogo = {
            "Artorius": "dialogo_Artorius.png",
        };
        this.rutaAssets = "../../Assets/dialog/"; 

        this.imagenesCaras = {
            "Artorius": "Artorius.png"
        };
        this.rutaPersonajes = "../../Assets/personajes/";
        
        // Estado interno
        this.colaDialogos = [];
        this.indiceActual = 0;
        this.intervaloEscritura = null;
        this.textoCompletoActual = "";
        
        this.crearInterfaz();
    }

    crearInterfaz() {
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI_Dialogos");

        this.retrato = new GUI.Image("imgRetrato", ""); 
        this.retrato.width = "680px";  
        this.retrato.height = "850px";
        this.retrato.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.retrato.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.retrato.left = "50px";
        this.retrato.top = "0px";
        this.retrato.isVisible = false;
        this.advancedTexture.addControl(this.retrato);

        this.contenedor = new GUI.Rectangle("ContenedorDialogo");
        this.contenedor.width = "1400px";
        this.contenedor.height = "800px";
        this.contenedor.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.contenedor.top = "-20px"; 
        this.contenedor.thickness = 0;
        this.contenedor.isVisible = false;
        this.advancedTexture.addControl(this.contenedor);

        // Cuadro dialogo
        this.imagenFondo = new GUI.Image("ImgFondo", "");
        this.imagenFondo.stretch = GUI.Image.STRETCH_UNIFORM;
        this.contenedor.addControl(this.imagenFondo);

        // Diseño de texto
        this.bloqueTexto = new GUI.TextBlock();
        this.bloqueTexto.text = "";
        this.bloqueTexto.color = "#F7D88E"; // O negro, según tu imagen
        this.bloqueTexto.fontFamily = "FuenteJuego";
        this.bloqueTexto.fontSize = 48;
        this.bloqueTexto.textWrapping = true;
        this.bloqueTexto.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.bloqueTexto.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        
        this.bloqueTexto.paddingLeft = "400px"; 
        this.bloqueTexto.paddingRight = "190px";
        this.bloqueTexto.paddingTop = "100px";
        this.bloqueTexto.paddingBottom = "20px";
        
        this.contenedor.addControl(this.bloqueTexto);
    }

    iniciar(guion) {
        if (this.dialogoActivo) return; 
        
        this.colaDialogos = guion;
        this.indiceActual = 0;
        this.dialogoActivo = true;
        this.contenedor.isVisible = true;

        this.mostrarLineaActual();
    }

    mostrarLineaActual() {
        // Verificacion de termino de dialogo
        if (this.indiceActual >= this.colaDialogos.length) {
            this.cerrar();
            return;
        }

        const linea = this.colaDialogos[this.indiceActual];

        this.textoCompletoActual = linea.texto.toUpperCase();

        const nombreArchivoCara = this.imagenesCaras[linea.personaje];

        if (nombreArchivoCara) {
            this.retrato.source = this.rutaPersonajes + nombreArchivoCara;
            
            this.retrato.isVisible = true; 
        } else {
            this.retrato.isVisible = false;
        }
        //cambio de imagenes
        const nombreImagen = this.cuadrosDialogo[linea.personaje] || this.cuadrosDialogo["default"];
        this.imagenFondo.source = this.rutaAssets + nombreImagen;

        this.bloqueTexto.text = ""
        let charIndex = 0;

        // Limpiar intervalos
        if (this.intervaloEscritura) clearInterval(this.intervaloEscritura);

        this.intervaloEscritura = setInterval(() => {
            this.bloqueTexto.text += this.textoCompletoActual[charIndex];
            charIndex++;

            if (charIndex >= this.textoCompletoActual.length) {
                clearInterval(this.intervaloEscritura);
                this.intervaloEscritura = null;
            }
        }, 30);
    }

    siguiente() {
        if (this.intervaloEscritura) {
            clearInterval(this.intervaloEscritura);
            this.intervaloEscritura = null;
            this.bloqueTexto.text = this.textoCompletoActual;
        } else {
            this.indiceActual++;
            this.mostrarLineaActual();
        }
    }

    cerrar() {
        this.contenedor.isVisible = false;
        this.retrato.isVisible=false
        this.dialogoActivo = false;
        this.bloqueTexto.text = "";
    }
}