'use strict';

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array de nomes de aplicações.
   */
  app_name: [process.env.NEW_RELIC_APP_NAME], // Usa a variável de ambiente ou um valor padrão
  /**
   * Chave de licença do New Relic.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY, // Usa a variável de ambiente ou um valor padrão (substitua 'CHAVE_PADRAO' se necessário)
  /**
   * Rastreio distribuído habilitado.
   */
  distributed_tracing: {
    enabled: true
  },
  logging: {
    /**
     * Nível de log.
     */
    level: 'info' // Você pode mudar para 'debug' ou 'trace' se precisar de mais detalhes
  }
};
