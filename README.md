# Arcade Marketplace

Arcade-Marketplace es un portal de compra-venta de productos retro centrados en el mundo gamer.
La plataforma hará de intermediaria entre vendedor y comprador y los usuarios solo podrán publicar o comprar si están registrados.

# WireFrame

Para ver al WireFrame interactivo accede a este enlace:

https://miro.com/app/board/uXjVOe1R7fg=/?invite_link_id=49270183990

# Antes que nada:

1. Clonar el repositorio desde la rama master. Si ya lo habías clonado, ejecutar en la terminal **_git pull_** donde lo tengas clonado.

2. Para hacer cualquier modificación crear una branch nueva con un nombre descriptivo y tu nombre al final. En la terminal:

   git checkout -b **_nombreDeLaRama-tuNombre_**

## INSTALAR NPM Y HACER MODIFICACIONES

1. Abrir el vsCode donde clonamos el repositorio.

2. En la terminal integrada ejecutar: **_npm install_** . Se instalarán todos los paquetes de npm.

3. Copiamos el **_template.env_**. En la terminal:

   cp template.env .env

4. Rellenamos manualmente el **_.env_**. Una vez hecho esto ya podemos hacer las modificaciones que querramos en el proyecto.

5. Para iniciar el nodemon ejecutar en la terminal integrada: **_npm run dev_**.

6. Una vez hemos comprobado que todo funciona ejecutamos:

   git add .
   git commit -m "**_mensaje descriptivo de lo que hemos hecho_**"
   git push --set-upstream origin **_nombreDeLaRama-tuNombre_**
