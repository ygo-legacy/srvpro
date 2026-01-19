/**
 * WindBot Provider
 * 
 * Proveedor que gestiona la comunicación con el servicio WindBot.
 * WindBot es un servicio separado que ejecuta IAs de YGOPro.
 */

const http = require('http');

/**
 * Crea el proveedor WindBot
 * @param {Object} config - Configuración del proveedor
 * @param {Array} botList - Lista de bots disponibles
 * @param {Object} deps - Dependencias (log, spawn, settings)
 */
module.exports = function createWindbotProvider(config, botList, deps) {
    const { log, spawn, settings } = deps;

    const HOST = config.config?.host || settings?.modules?.windbot?.server_ip || 'localhost';
    const PORT = config.config?.port || settings?.modules?.windbot?.port || 2399;

    let windbotProcess = null;
    let loopLimit = 0;

    log.info(`[Bots:windbot] Initialized - host: ${HOST}, port: ${PORT}`);

    return {
        /**
         * Obtiene la lista de bots disponibles
         * @returns {Array} Lista de bots
         */
        getBots() {
            return botList;
        },

        /**
         * Invoca a WindBot para que se una a una sala
         * @param {Object} bot - Datos del bot a invocar
         * @param {Object} room - Información de la sala
         */
        spawnBot(bot, room) {
            const postData = JSON.stringify({
                name: bot.name,
                deck: bot.deck,
                host: room.serverIp || settings.modules.windbot.my_ip,
                port: room.port || settings.port,
                dialog: bot.dialog || 'default',
                version: room.version || settings.version,
                password: room.password || ''
            });

            const options = {
                hostname: HOST,
                port: PORT,
                path: '/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = http.request(options, (res) => {
                if (res.statusCode === 200) {
                    log.info(`[Bots:windbot] Bot ${bot.name} spawned successfully`);
                } else {
                    log.warn(`[Bots:windbot] Failed to spawn bot: ${res.statusCode}`);
                }
            });

            req.on('error', (e) => {
                log.warn(`[Bots:windbot] Request error: ${e.message}`);
            });

            req.write(postData);
            req.end();
        },

        /**
         * Inicia el proceso de WindBot (si está configurado para spawn local)
         * Solo se usa cuando WindBot corre en el mismo servidor
         */
        startProcess() {
            if (!settings.modules.windbot.spawn) {
                return;
            }

            const isWindows = /^win/.test(process.platform);
            const windbotBin = isWindows ? 'WindBot.exe' : 'mono';
            const params = isWindows ? [] : ['WindBot.exe'];

            params.push('ServerMode=true');
            params.push(`ServerPort=${PORT}`);

            windbotProcess = spawn(windbotBin, params, { cwd: 'windbot' });

            windbotProcess.on('error', (err) => {
                log.warn('[Bots:windbot] Process ERROR', err);
                if (loopLimit < 1000 && !global.rebooted) {
                    loopLimit++;
                    this.startProcess();
                }
            });

            windbotProcess.on('exit', (code) => {
                log.warn('[Bots:windbot] Process EXIT', code);
                if (loopLimit < 1000 && !global.rebooted) {
                    loopLimit++;
                    this.startProcess();
                }
            });

            windbotProcess.stdout.setEncoding('utf8');
            windbotProcess.stdout.on('data', (data) => log.info('[Bots:windbot]', data));

            windbotProcess.stderr.setEncoding('utf8');
            windbotProcess.stderr.on('data', (data) => log.warn('[Bots:windbot] Error:', data));
        }
    };
};
