const juego = {
  timerId: 0,
  timerObstaculos: 0,
  gravedad: 2,
  skyHeight: 580,

  aleatorio: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  verificaColision: function () {
    if (bird.colision()) {
      juego.terminar();
    }
  },

  loop: function () {
    bird.efectoGravedad();
    obstaculos.mover();
    bird.dibujar(); 
    obstaculos.dibujar();
    juego.verificaColision();
  },

  iniciar: function () {
    document.addEventListener("keyup", bird.mover);
    obstaculos.crear();
    juego.timerObstaculos = setInterval(obstaculos.crear, 3000);
    juego.timerId = setInterval(juego.loop, 20);
    
  },

  terminar: function () {  
    clearInterval(juego.timerId);
    clearInterval(juego.timerObstaculos);
    juego.mostrarGameOver();
    juego.pararEfectos();
  },

  mostrarGameOver: function () {
    const mensaje = document.querySelector(".message");
    mensaje.setAttribute("id", "game-over");
  },

  pararEfectos: function () {
    let ground = document.querySelector(".ground");
    ground.removeAttribute("id");

    bird.div.setAttribute("id", "fall");
  },
};


const bird = {
  div: document.querySelector(".bird"),
  bottom: juego.aleatorio(10, 570),
  left: 250,
  width: 60,
  height: 45,

  efectoGravedad: function () {
    bird.bottom -= juego.gravedad;
  },

  dibujar: function () {
    bird.div.style.bottom = bird.bottom + "px";
    bird.div.style.left = bird.left + "px";
  },

  mover: function () {
    bird.bottom += 40;
  },

  colision: function () {
      if (bird.bottom < 0) {
        return true;
      }
    },
}


const obstaculos = {
  obstacleContainer: document.querySelector(".obstacles"),
  velocidad: 1,
  gap: 200,
  maxHeight: 320,
  minHeight: 50,
  width: 52,
  lista: [],

  crear: function () {
    const topObstacle = document.createElement("div");
    const bottomObstacle = document.createElement("div");
    topObstacle.classList.add("topObstacle");
    bottomObstacle.classList.add("bottomObstacle");
    obstaculos.obstacleContainer.appendChild(topObstacle);
    obstaculos.obstacleContainer.appendChild(bottomObstacle);

    topObstacleHeight = Math.max(
      Math.random() * obstaculos.maxHeight,
      obstaculos.minHeight
    );
    bottomObstacleHeight = Math.min(
      juego.skyHeight - topObstacleHeight - obstaculos.gap,
      obstaculos.maxHeight
    );

    const parObstaculos = {
      topObstacle: topObstacle,
      bottomObstacle: bottomObstacle,
      left: window.innerWidth,
      width: obstaculos.width,
      topObstacleHeight: topObstacleHeight,
      bottomObstacleHeight: bottomObstacleHeight,
      topObstacleBottom: juego.skyHeight - topObstacleHeight,
      bottomObstacleBottom: 0,
    };
    obstaculos.lista.push(parObstaculos);
  },

  // 1. Agrega el método eliminar()
  eliminar: function (parObstaculos) {
    if (parObstaculos.left + obstaculos.width < 0) {
      parObstaculos.bottomObstacle.remove();
      parObstaculos.topObstacle.remove();
      obstaculos.lista.shift();
      console.log(obstaculos.lista.length);
    }
  },

  mover: function () {
    for (var i = 0; i < obstaculos.lista.length; i++) {
      obstaculos.lista[i].left -= obstaculos.velocidad;

      // 2. Llama a obstaculos.eliminar(), proporcionando como argumento cada elemento de obstaculos.lista
      obstaculos.eliminar(obstaculos.lista[i]);
    }
  },

  dibujar: function () {
    for (var i = 0; i < obstaculos.lista.length; i++) {
      obstaculos.lista[i].topObstacle.style.left =
        obstaculos.lista[i].left + "px";
      obstaculos.lista[i].bottomObstacle.style.left =
        obstaculos.lista[i].left + "px";

      obstaculos.lista[i].topObstacle.style.height =
        obstaculos.lista[i].topObstacleHeight + "px";
      obstaculos.lista[i].bottomObstacle.style.height =
        obstaculos.lista[i].bottomObstacleHeight + "px";
    }
  },
};


juego.iniciar();