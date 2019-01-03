var OV;
var session;

const possibleEmojis = [
    '🐀', '🐁', '🐭', '🐹', '🐂', '🐃', '🐄', '🐮', '🐅', '🐆', '🐯', '🐇', '🐐', '🐑', '🐏', '🐴',
    '🐎', '🐱', '🐈', '🐰', '🐓', '🐔', '🐤', '🐣', '🐥', '🐦', '🐧', '🐘', '🐩', '🐕', '🐷', '🐖',
    '🐗', '🐫', '🐪', '🐶', '🐺', '🐻', '🐨', '🐼', '🐵', '🙈', '🙉', '🙊', '🐒', '🐉', '🐲', '🐊',
    '🐍', '🐢', '🐸', '🐋', '🐳', '🐬', '🐙', '🐟', '🐠', '🐡', '🐚', '🐌', '🐛', '🐜', '🐝', '🐞',
];

function randomEmoji() {
    var randomIndex = Math.floor(Math.random() * possibleEmojis.length);
    return possibleEmojis[randomIndex];
}

const emoji = randomEmoji();
const name = prompt("Kien ereh?");

function joinSession() {

    var mySessionId = document.getElementById("sessionId").value;

    OV = new OpenVidu();
    session = OV.initSession();

    session.on("streamCreated", function(event) {
        session.subscribe(event.stream, "subscriber");
    });

    session.on('signal', (event) => {
        var mensaje = event.data.mensaje;
        var nombre = event.data.nombre;

        console.log("Este es el objeto:")
        console.log(event)
        console.log(Object.keys(event));

        // Si quien ha enviado el mensaje soy yo...
        if (event.from.connectionId === session.connection.connectionId) {
            mensaje = nombre + " <-- " + mensaje;
        } else {
            mensaje = nombre + " --> " + mensaje;
        }

        var chat = document.getElementById("chat");
        if (chat.value === "") {
            chat.value = mensaje;
        } else {
            chat.value = chat.value + "\n" + mensaje;
        }
    });

    getToken(mySessionId).then(token => {

        session.connect(token)
            .then(() => {
                document.getElementById("session-header").innerText = mySessionId;
                document.getElementById("join").style.display = "none";
                document.getElementById("session").style.display = "block";
                document.getElementById("ventana_chat").style.display = "block";

                var publisher = OV.initPublisher("publisher");
                session.publish(publisher);

            })
            .catch(error => {
                console.log("There was an error connecting to the session:", error.code, error.message);
            });
    });
}

function leaveSession() {
    session.disconnect();
    document.getElementById("join").style.display = "block";
    document.getElementById("session").style.display = "none";
}

window.onbeforeunload = function() {
    if (session) session.disconnect()
};

function mandar_mensaje() {
    var mensaje = document.getElementById("mensaje").value;

    session.signal({
            data: {mensaje: mensaje, nombre: emoji + " " + name},
            to: [],
            type: 'my-chat',
        })
        .then(() => {
            console.log("Mensaje enviado");
            // chat.value = chat.value + "\n" + mensaje;
        })
        .catch(error => {
            console.error(error);
        })
}


/**
 * --------------------------
 * SERVER-SIDE RESPONSIBILITY
 * --------------------------
 * These methods retrieve the mandatory user token from OpenVidu Server.
 * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
 * the API REST, openvidu-java-client or openvidu-node-client):
 *   1) Initialize a session in OpenVidu Server	(POST /api/sessions)
 *   2) Generate a token in OpenVidu Server		(POST /api/tokens)
 *   3) The token must be consumed in Session.connect() method
 */

var OPENVIDU_SERVER_URL = "https://" + location.hostname + ":4443";
var OPENVIDU_SERVER_SECRET = "MY_SECRET";

function getToken(mySessionId) {
    return createSession(mySessionId).then(sessionId => createToken(sessionId));
}

function createSession(sessionId) { // See https://openvidu.io/docs/reference-docs/REST-API/#post-apisessions
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: OPENVIDU_SERVER_URL + "/api/sessions",
            data: JSON.stringify({
                customSessionId: sessionId
            }),
            headers: {
                "Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
                "Content-Type": "application/json"
            },
            success: response => resolve(response.id),
            error: (error) => {
                if (error.status === 409) {
                    resolve(sessionId);
                } else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
                    if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + OPENVIDU_SERVER_URL + '\"\n\nClick OK to navigate and accept it. ' +
                            'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' + OPENVIDU_SERVER_URL + '"')) {
                        location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                    }
                }
            }
        });
    });
}

function createToken(sessionId) { // See https://openvidu.io/docs/reference-docs/REST-API/#post-apitokens
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: OPENVIDU_SERVER_URL + "/api/tokens",
            data: JSON.stringify({
                session: sessionId
            }),
            headers: {
                "Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
                "Content-Type": "application/json"
            },
            success: response => resolve(response.token),
            error: error => reject(error)
        });
    });
}
