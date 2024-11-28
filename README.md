<h1>Ecosistema Soucannabis</h1>
<p>Projeto Open Source com a licença GNU General Public License v3.0 </p>
<br>
<p>Um ecosistema para gerenciamento de Associações Terapêuticas de Cannabis Medicinal.</p>
<p>Desenvolvido pela <a href"https://soucannabis.ong.br/" target="_blank">Associação Sou Cannabis</a> https://soucannabis.ong.br</p>
<br>
<b>Todos os sistemas do Ecosistema SouCannabis são Open Source e são interligados através do Cadastramento de Associados, uma estrutura comlpeta para armazenamento de dados de associados, assinatura de termos de adesão, suporte para conversas por Whats'app e Email em um só canal para o time de acolhimento e dashboard com análise de dados de associados.</b>
<br><br>
<p>O Ecosistema é composto por:</p>
<ul>
<li>Cadastramento - Cadastro de associados - https://github.com/soucannabis/ecosistemasoucannabis</li>
<li>Cadastramento Server - Cadastro de associados - https://github.com/soucannabis/ecosistemasoucannabis-server</li>
<li>Directus - Gerenciamento de banco de dados - https://github.com/directus/directus</li>
<li>Chatwoot - Gerenciamento de conversas por Whats'app - https://github.com/chatwoot/chatwoot</li>
<li>DocuSeal - Assinatura de contratos online - https://github.com/docusealco/docuseal</li>
<li>Meta Base - Dashboards para analise de dados - https://www.metabase.com/</li>
<li>Magento - Plataforma e-commerce - https://business.adobe.com/products/magento/magento-commerce.html</li>
<li>(Em desenvolvimento) Loja virtual no sistema de cadastramento integrado com Magento E-commerce</li>
</ul>
<br>
<p>Instalação do Cadastramento:</p>
<ul>
<li>git clone https://github.com/soucannabisdev/ecosistemasoucannabis</li>
  <li>cd ecosistemasoucannabis</li>
  <li>npm install</li>
  <li>Crie um arquivo .env com as seguintes variaveis de ambiente</li>
  <br>
  <p>VITE_URL= //URL de instalação do Cadastramento</p>
  <p>VITE_SERVER_URL= //URL de instalação do Cadastramento Server</p>
<p>VITE_SERVER_API_TOKEN= //Cadastramento Server API Token</p>
<p>VITE_DIRECTUS_API_URL= //URL do Directus </p>
<p>VITE_DIRECTUS_API_TOKEN= //Token do Directus</p>
<p>VITE_DOCUSEAL_URL= //URL de instalação do Docuseal</p>
<p>VITE_PASS_ENCRYPT= //Senha aleatória para criação de criptografia</p>
<p>WDS_SOCKET_PORT=0 //Variavel para funcionamento correto de Websockets</p>  
<li>npm start</li>
</ul>

<p>Instalação do Servidor:</p>
<ul>
<li>git clone https://github.com/soucannabisdev/ecosistemasoucannabis-server</li>
  <li>cd ecosistemasoucannabis-server</li>
  <li>npm install</li>
  <li>Crie um arquivo .env com as seguintes variaveis de ambiente</li>
  <br>
<p>  DIRECTUS_API_URL= //URL do Directus</p>
<p>DIRECTUS_API_TOKEN= //Token do Directus</p>
<p>CORS= // URL do Cadstramento</p>
<p>PASS_ENCRYPT= //Senha aleatória para criação de criptografia</p>
<p>PORT=8055 #Porta do Servidor</p>
  <br>
  <p>Se tiver Chatwoot Instalado</p>
<p>CHATWOOT_URL= //Chatwoot URL</p>
<p>CHATWOOT_API_URL= //URL da API do Whats'app</p>
<p>CHATWOOT_INSTANCE_NAME= //Nome da Instancia</p>
<p>CHATWOOT_API_KEY= //Chatwoot API key</p>
<p>CHANNEL_ID= // Canal de atendimento no Chatwoot</p>
<p>CHATWOOT_ACCOUNT_ID= //Número da conta no Chatwoot</p>
<p>CHATWOOT_TOKEN= // Token do Chatwoot  </p>
  <li>npm start</li>

</ul>
