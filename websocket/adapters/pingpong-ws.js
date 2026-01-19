/**
 * PingPong WebSocket Adapter
 * 
 * Implementa keepalive con ping/pong para mantener conexiones activas.
 * Este es el adapter por defecto para YGO Legacy.
 */

/**
 * Crea el adapter pingpong-ws
 * @param {Object} config - Configuración
 * @param {number} config.pingInterval - Intervalo de ping en ms (default: 30000)
 * @param {boolean} config.tcpKeepAlive - Habilitar TCP keep-alive (default: true)
 */
module.exports = function createPingPongAdapter(config) {
    const PING_INTERVAL = config.pingInterval || 30000;
    const TCP_KEEPALIVE = config.tcpKeepAlive !== false;

    console.log(`[WebSocket:pingpong-ws] Initialized - pingInterval: ${PING_INTERVAL}ms, tcpKeepAlive: ${TCP_KEEPALIVE}`);

    return {
        /**
         * Configura el cliente WebSocket con ping/pong
         * @param {WebSocket} client - Cliente WebSocket
         */
        setup(client) {
            // Marcar cliente como vivo
            client.isAlive = true;

            // Manejar respuestas pong
            client.on('pong', () => {
                client.isAlive = true;
            });

            // Intervalo de ping
            const pingInterval = setInterval(() => {
                if (client.isAlive === false) {
                    console.log('[WebSocket:pingpong-ws] Client not responding, terminating');
                    clearInterval(pingInterval);
                    return client.terminate();
                }

                client.isAlive = false;

                // Enviar ping si el cliente sigue abierto
                if (client.readyState === 1) { // WebSocket.OPEN
                    client.ping();
                }
            }, PING_INTERVAL);

            // Limpiar intervalo al cerrar
            client.on('close', () => {
                clearInterval(pingInterval);
            });

            // Configurar TCP keep-alive si está disponible
            if (TCP_KEEPALIVE && client._socket) {
                client._socket.setKeepAlive(true, PING_INTERVAL);
            }
        }
    };
};
