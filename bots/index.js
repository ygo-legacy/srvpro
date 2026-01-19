/**
 * Bot Provider Factory
 * 
 * Carga y gestiona el proveedor de IA configurado.
 * Los proveedores manejan la interacción con diferentes sistemas de IA.
 */

const fs = require('fs');
const path = require('path');

const providers = {
    'windbot': require('./providers/windbot'),
    'custom': require('./providers/custom')
};

/**
 * Crea un proveedor de bots basado en la configuración
 * @param {Object} config - Configuración de bots desde config.json
 * @param {Object} dependencies - Dependencias inyectadas (log, spawn, etc.)
 * @returns {Object} Proveedor con métodos getBots() y spawnBot()
 */
function createBotProvider(config, dependencies) {
    if (!config) {
        throw new Error('Bots config is required when bots module is enabled');
    }

    const providerName = config.provider || 'windbot';
    const ProviderFactory = providers[providerName];

    if (!ProviderFactory) {
        throw new Error(`Unknown bot provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
    }

    // Cargar lista de bots
    let botList = [];
    if (config.botlist) {
        try {
            const botlistPath = path.resolve(config.botlist);
            const botlistData = JSON.parse(fs.readFileSync(botlistPath, 'utf8'));
            botList = botlistData.windbots || botlistData.bots || [];
            dependencies.log.info(`[Bots] Loaded ${botList.length} bots from ${config.botlist}`);
        } catch (e) {
            dependencies.log.warn(`[Bots] Failed to load botlist: ${e.message}`);
        }
    }

    dependencies.log.info(`[Bots] Using provider: ${providerName}`);
    return ProviderFactory(config, botList, dependencies);
}

module.exports = createBotProvider;
