# Chat WebRTC multiusuario
Chat de texto multiusuario desarollado a partir de las herramientas que provee [OpenVidu](https://openvidu.io/). Como base se ha utilizado uno de los tutoriales con los que cuenta la plataforma OpenVidu, más concretamente [openvidu-hello-world](https://openvidu.io/docs/tutorials/openvidu-hello-world/).

## Despliegue del chat
En primer lugar debemos instalar un servidor web para poder desplegar la carpeta de nuestro proyecto. Mediante node.js instalaremos http-server para servir los ficheros de la aplicación en cuestión. Lo instalaremos de la siguiente manera:
```
npm install -g http-server
```
En la carpeta del proyecto ejecutamos 
```
http-server .
```
Finalmente (en otra consola) ejecutaremos este comando para correr el contenedor de Docker con openvidu-server y Kurento Media Server ya que son necesarios para el funcionamiento de este proyecto.
```
docker run -p 4443:4443 --rm -e openvidu.secret=MY_SECRET openvidu/openvidu-server-kms:2.7.0
```
Una vez hecho esto solo queda acceder a la siguiente URL donde estará alojada la aplicación:
```
localhost:8080
```
## Aspecto chat en funcionamiento
A continuación, se exponen diferentes capturas (correspondientes a los diferentes usuarios: Alice, Bob y Peter) utilizando el chat de forma simultánea.
<p align="center">
<img src="https://github.com/DarwinGonzalez/Openvidu-Multiuser-Text-Chat/blob/master/images/alice.png?raw=true" width="30%" height="30%">
<img src="https://github.com/DarwinGonzalez/Openvidu-Multiuser-Text-Chat/blob/master/images/bob.png?raw=true" width="30%" height="30%">
<img src="https://github.com/DarwinGonzalez/Openvidu-Multiuser-Text-Chat/blob/master/images/peter.png?raw=true" width="30%" height="30%">
</p>
