/**
 * Custom Bot Provider (Placeholder)
 * 
 * Proveedor placeholder para futuras implementaciones de IA personalizada.
 * Este archivo sirve como referencia para implementar nuevos proveedores.
 */

/**
 * Crea el proveedor Custom
 * @param {Object} config - Configuración del proveedor
 * @param {Array} botList - Lista de bots disponibles
 * @param {Object} deps - Dependencias (log, spawn, settings)
 */
module.exports = function createCustomProvider(config, botList, deps) {
    const { log } = deps;

    log.info('[Bots:custom] Initialized - placeholder provider');

    return {
        /**
         * Obtiene la lista de bots disponibles
         * @returns {Array} Lista de bots
         */
        getBots() {
            return botList;
        },

        /**
         * Invoca un bot para que se una a una sala
         * @param {Object} bot - Datos del bot a invocar
         * @param {Object} room - Información de la sala
         */
        spawnBot(bot, room) {
            log.warn('[Bots:custom] spawnBot not implemented');
            // TODO: Implementar lógica de IA personalizada
        },

        /**
         * Inicia el servicio de IA (si aplica)
         */
        startProcess() {
            // No-op para este placeholder
        }
    };
};
