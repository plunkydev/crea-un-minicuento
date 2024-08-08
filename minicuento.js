let instructionImages = [
    "./instrucciones/instrucionesMinicuento1.jpg",
    "./instrucciones/instrucionesMinicuento2.jpg",
    "./instrucciones/instrucionesMinicuento3.jpg",
    "./instrucciones/instrucionesMinicuento4para5Minutos.jpg",
    "./instrucciones/instrucionesMinicuento5.jpg",
],
    cont = 0,
    images = [
        "./imagenes-a-azar/azar1.jpg",
        "./imagenes-a-azar/azar2.jpg",
        "./imagenes-a-azar/azar3.jpg",
        "./imagenes-a-azar/azar4.jpg",
        "./imagenes-a-azar/azar5.jpg",
        "./imagenes-a-azar/azar6.jpg",
        "./imagenes-a-azar/azar7.jpg",
        "./imagenes-a-azar/azar8.jpg",
        "./imagenes-a-azar/azar9.jpg",
        "./imagenes-a-azar/azar10.jpg",
        "./imagenes-a-azar/azar11.jpg",
        "./imagenes-a-azar/azar12.jpg",
        "./imagenes-a-azar/azar13.jpg",
        "./imagenes-a-azar/azar14.jpg",
        "./imagenes-a-azar/azar15.jpg",
        "./imagenes-a-azar/azar16.jpg",
        "./imagenes-a-azar/azar17.jpg",
        "./imagenes-a-azar/azar18.jpg",
        "./imagenes-a-azar/azar19.jpg",
        "./imagenes-a-azar/azar20.jpg",
    ];

function carrusel() {
    let atras = document.getElementById("atras");
    let adelante = document.getElementById("adelante");
    let img = document.getElementById("carruselImagen");

    if (atras && adelante && img) {
        atras.addEventListener("click", () => {
            if (cont > 0) {
                img.src = instructionImages[cont - 1];
                cont--;
            } else {
                img.src = instructionImages[instructionImages.length - 1];
                cont = instructionImages.length - 1;
            }
        });

        adelante.addEventListener("click", () => {
            if (cont < instructionImages.length - 1) {
                img.src = instructionImages[cont + 1];
                cont++;
            } else {
                img.src = instructionImages[0];
                cont = 0;
            }
        });
    } else {
        console.error("No se encontraron los elementos del carrusel.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let carruselContenedor = document.getElementById("carruselContenedor");
    if (carruselContenedor) {
        carrusel();
    }
});

class CarruselComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList = "carruselContenedor";
        this.id = "carrusel";
        this.innerHTML = `
        <div class="carruselContenedor" id="carruselContenedor"><div class="atras carruselBotones" id="atras"><span><</span></div>
        <div class="adelante carruselBotones" id="adelante"><span>></span></div>
        <img src="./instrucciones/instrucionesMinicuento1.jpg" id="carruselImagen">`;
    }
}

window.customElements.define("carrusel-component", CarruselComponent);

let countdownActive = false;

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

function showRandomImage() {
    if (countdownActive) return;

    const imageContainer = document.getElementById("imageContainer");
    const imgElement = document.createElement("img");
    imgElement.src = getRandomImage();
    imgElement.loading = "lazy";
    imgElement.id = "currentImage";
    imgElement.className = "imgRandom";

    imageContainer.innerHTML = "";
    imageContainer.appendChild(imgElement);

    imgElement.addEventListener("click", showRandomImage);
}

function captureElementAndDownload() {
    var element = document.querySelector("#printCuento");
    if (!element) {
        console.error("Element not found");
        return;
    }

    html2canvas(element)
        .then((canvas) => {
            var image = canvas.toDataURL("image/jpeg");
            var link = document.createElement("a");
            link.href = image;
            link.download = "Mi_Mini_Cuento.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.error("Error capturing element:", error);
        });
}

function startCountdown() {
    countdownActive = true;
    let countdown = 5;  // Cambia este valor a 300 (5 minutos) si es necesario
    const button = document.getElementById("changeImageButton");
    button.classList.remove("tracking-in-contract");
    button.disabled = false;

    const intervalId = setInterval(() => {
        let minutes = Math.floor(countdown / 60);
        let seconds = countdown % 60;
        button.textContent = `¡Inspírate! ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        countdown--;

        if (countdown < 0) {
            clearInterval(intervalId);
            let imagePre = document.getElementById("currentImage");
            imagePre.style.opacity = "0.3";
            button.textContent = "¡Escribe!";
            button.disabled = false;
            countdownActive = false;
            showTextArea();

            // Iniciar la segunda cuenta regresiva de 10 segundos
            startSecondCountdown(button);
        }
    }, 1000);
}

function startSecondCountdown(button) {
    let secondCountdown = 5;  // Cambia este valor a 600 (10 minutos) si es necesario
    countdownActive = true;
    const secondIntervalId = setInterval(() => {
        let minutes = Math.floor(secondCountdown / 60);
        let seconds = secondCountdown % 60;
        button.textContent = `Crea ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        secondCountdown--;

        if (secondCountdown < 0) {
            const contenido = document.querySelector("#imageContainer");
            const textArea = document.getElementById("miniCuento");
            contenido.removeChild(textArea);
            clearInterval(secondIntervalId);
            button.textContent = "Mi Mini Cuento";
            button.disabled = false;

            setTimeout(() => {
                captureElementAndDownload();
            }, 1000);
        }
    }, 1000);
}


function showTextArea() {
    const imageContainer = document.getElementById("imageContainer");
    const currentImg = imageContainer.querySelector("img#currentImage");
    const parrafoElement = document.createElement("p");
    parrafoElement.classList = "parrafoCuento";

    if (currentImg) {
        const textArea = document.createElement("textarea");
        textArea.id = "miniCuento";
        textArea.placeholder = "Escribe tu mini cuento aquí...";
        textArea.classList = "miniCuento";
        textArea.addEventListener("input", function () {
            parrafoElement.innerText = textArea.value;
        });

        imageContainer.appendChild(textArea);
        imageContainer.appendChild(parrafoElement);
        textArea.focus();
    }
}

document.getElementById("changeImageButton").addEventListener("click", () => {
    if (!countdownActive) {
        showRandomImage();
        startCountdown();
    }
});

window.onload = () => {
    const imageContainer = document.getElementById("imageContainer");
    const carruselElement = document.createElement("carrusel-component");
    imageContainer.appendChild(carruselElement);
    carrusel();
};
