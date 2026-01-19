/**
 * Neos-TS Client Adapter
 * 
 * Adapter de compatibilidad con comportamiento original.
 * Sin keepalive ni ping/pong - solo para referencia o casos especiales.
 */

/**
 * Crea el adapter neos-ts-client (comportamiento original)
 * @param {Object} config - Configuración (no usada en este adapter)
 */
module.exports = function createNeosTsClientAdapter(config) {
    console.log('[WebSocket:neos-ts-client] Initialized - no keepalive');

    return {
        /**
         * Configura el cliente WebSocket (sin keepalive)
         * @param {WebSocket} client - Cliente WebSocket
         */
        setup(client) {
            // Sin configuración adicional
            // Este adapter mantiene el comportamiento original
        }
    };
};
