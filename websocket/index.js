/**
 * WebSocket Adapter Factory
 * 
 * Carga y aplica el adapter de WebSocket configurado.
 * Los adapters manejan el comportamiento de conexión (keepalive, timeouts, etc.)
 */

const path = require('path');

const adapters = {
    'pingpong-ws': require('./adapters/pingpong-ws'),
    'neos-ts-client': require('./adapters/neos-ts-client')
};

/**
 * Crea un handler de WebSocket con el adapter configurado
 * @param {Object} config - Configuración de websocket desde config.json
 * @returns {Object} Adapter con método setup()
 */
function createWebSocketHandler(config) {
    if (!config) {
        throw new Error('WebSocket config is required when neos module is enabled');
    }

    const adapterName = config.adapter || 'pingpong-ws';
    const AdapterFactory = adapters[adapterName];

    if (!AdapterFactory) {
        throw new Error(`Unknown WebSocket adapter: ${adapterName}. Available: ${Object.keys(adapters).join(', ')}`);
    }

    console.log(`[WebSocket] Using adapter: ${adapterName}`);
    return AdapterFactory(config);
}

module.exports = createWebSocketHandler;
