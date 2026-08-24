# Landing page de franquias — 321 Modular

Site estático e sem etapa de build, preparado para rodar diretamente no GitHub Pages.

## Estrutura

- `index.html`: conteúdo e estrutura semântica.
- `styles.css`: identidade visual, responsividade e animações de interface.
- `app.js`: direção da animação vetorial ligada ao scroll, formulário e interações.
- `assets/`: logo, fonte e imagem social.
- `.nojekyll`: impede processamento desnecessário pelo Jekyll no GitHub Pages.

Não há React, Node.js, npm, CDN ou servidor de aplicação em produção. A versão estática reproduz a estrutura e a animação da landing page de referência diretamente no navegador.

## Publicação no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie **o conteúdo desta pasta** para a raiz do repositório.
3. No GitHub, abra `Settings` → `Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Selecione a branch `main`, pasta `/(root)` e clique em `Save`.
6. Aguarde o endereço público informado pelo GitHub.

Todos os caminhos do site são relativos (`./assets/...`), então ele funciona em URLs como `usuario.github.io/nome-do-repositorio/`.

## Visualização local

O site pode ser aberto diretamente pelo `index.html`. Para reproduzir o comportamento do GitHub Pages com mais fidelidade, também é possível usar um servidor HTTP local.

Com Python instalado:

```powershell
python -m http.server 4173
```

Depois, acesse `http://localhost:4173`.

## Ativar o formulário

O GitHub Pages não executa backend. O formulário reproduz o estado demonstrativo da página de referência e informa que a conexão com o CRM será ativada antes da publicação comercial. Antes de receber tráfego, ele deve ser integrado a um endpoint HTTPS real, como um webhook do CRM ou serviço de formulários.

## Antes de anunciar

- Substitua textos, contatos e condições comerciais pelos dados aprovados pela franqueadora.
- Acrescente Política de Privacidade e Termos de Uso aprovados juridicamente.
- Atualize `og:image` e a URL canônica para URLs absolutas depois que o domínio definitivo existir.
- Teste o endpoint do formulário no domínio final.
- Comprima `assets/og.png` se desejar reduzir ainda mais o peso inicial.

## Viagem logística contínua

O mesmo caminhão 2D acompanha o visitante desde o hero até a implantação. No início, a primeira parte do scroll mantém o hero fixado enquanto uma empilhadeira carrega dois módulos na carroceria dentro de uma fábrica estilizada. Depois, o veículo percorre uma rota SVG única que atravessa Oportunidade, Modelo, Chalés, Processo, comparativo, Perfil, Territórios e FAQ.

A rota é construída dinamicamente em `app.js` a partir da posição real de cada seção. Assim, o traçado continua correto mesmo quando a altura do conteúdo ou a largura da tela muda. O caminhão segue a tangente da curva — evitando andar de ré — e o trecho percorrido recebe o destaque laranja da marca.

As seções reservam corredores centrais ou laterais para a rota em desktop, tablet e celular, inclusive uma abertura física no mapa territorial. O JavaScript lê as colunas efetivamente renderizadas de cada grade e mantém dois pontos da rota dentro do corredor de cada seção; as mudanças de faixa acontecem apenas nas áreas de respiro entre conteúdos. No celular, cards, comparativo e textos usam uma faixa editorial própria à esquerda, deixando a viagem livre à direita. O centro visual do SVG do caminhão coincide com o centro geométrico da rota mesmo durante as curvas. A sombra de tipografia continua disponível apenas como proteção extrema. O caminhão é fixo na viewport e sua posição horizontal é vinculada diretamente ao scroll; por isso ele não acompanha a página por um frame antes de voltar.

Ao alcançar `data-journey-destination`, a rota global termina exatamente no primeiro ponto da estrada do terreno. As tangentes coincidem e gradientes aplicados diretamente aos traços fazem o material da rota geral desaparecer enquanto o acabamento do terreno surge, sem máscaras ou recortes. A espessura física dos dois trechos é sincronizada em tempo real para permanecer idêntica em qualquer viewport. O mesmo veículo percorre essa continuação e para no fim do traçado, sem troca ou corte entre caminhões. A câmera começa afastada e aproxima toda a cena antes do início da montagem; posição e escala são calculadas pela matriz real do SVG para permanecerem alinhadas em qualquer viewport. Durante o zoom, a estrada desaparece somente por fade de opacidade, sem deslocamento vertical.

A continuação do scroll controla dois içamentos sucessivos de um munck articulado em uma camada acima do caminhão. A articulação principal é ancorada pela posição renderizada da cabine em cada frame, eliminando desalinhamentos entre desktop, tablet e celular. Os painéis içados repetem exatamente desenho, cor e proporções dos painéis da carroceria; a posição inicial é calculada pela geometria renderizada do próprio caminhão. Depois de instalar o primeiro, base, cotovelo, lança, cabo e gancho retornam vazios à carroceria, conectam o segundo painel e repetem o transporte. A conclusão também é progressiva: as duas águas do telhado se fecham, a cumeeira aparece e depois entram deck, acesso e iluminação. A montagem termina aos 72% do trecho fixado; o restante mantém o chalé pronto na tela por mais de uma viewport antes da transição para o formulário. Toda a implementação usa SVG, CSS e JavaScript nativo, sem vídeo, canvas, CDN ou dependências externas.

Os dois painéis já aparecem posicionados na área de preparação da fábrica desde o primeiro quadro, evitando qualquer surgimento repentino durante o carregamento. No celular, a câmera da implantação usa uma composição ampliada para tornar o caminhão, o munck e a montagem legíveis sem reduzir o texto editorial.

O pré-cadastro foi compactado para caber integralmente em uma viewport de computador a partir de 1024 px de largura. Os campos de seleção usam uma combobox própria, acessível por teclado, com menu, estados de foco, seleção e camadas visuais alinhados à identidade da página; o `select` nativo continua sincronizado para validação e envio do formulário.

O campo de WhatsApp aplica automaticamente a máscara brasileira para números fixos e celulares, mantendo somente 10 ou 11 dígitos. O e-mail é validado enquanto a pessoa digita e apresenta retorno visual acessível antes do envio.

Estado e cidade usam a API oficial de Localidades do IBGE. A lista completa de UFs permanece também no HTML como fallback; após escolher uma UF, a combobox pesquisável de cidades consulta e armazena os municípios daquela unidade federativa no navegador.

As três fotografias da seção Chalés estão salvas localmente em `assets/chale-instagram-01.jpg`, `assets/chale-instagram-02.jpg` e `assets/chale-instagram-03.jpg`. A página publicada não depende do Instagram para exibi-las. O grid reserva uma coluna central exclusiva para a passagem do caminhão.

Na saída da fábrica, cada painel agora é movimentado pela empilhadeira em seis momentos legíveis — aproximação vazia, encaixe dos garfos, elevação, transporte, descida e recuo. A aproximação acontece por uma curva própria, com esterçamento visível; entre os dois painéis, o equipamento se afasta pela lateral e contorna a carga antes de alinhar novamente. Empilhadeira, garfos e painel formam um conjunto cinemático: a carga gira com o equipamento durante as curvas e retorna progressivamente ao alinhamento da carroceria na aproximação final. O painel recebe zoom progressivo e sombra mais distante durante a subida, retornando à escala normal quando é apoiado. A empilhadeira fica em uma camada abaixo da carroceria e dos painéis, fazendo os garfos parecerem encaixados sob a carga. O capítulo da fábrica ocupa três viewports, oferecendo mais de duas vezes o percurso de rolagem da versão anterior. A estrada permanece invisível durante a operação e surge em crossfade somente depois do segundo painel estar assentado, enquanto a fábrica e a empilhadeira desaparecem. Nas curvas, o caminhão volta a apontar diretamente para a tangente da estrada, sem atraso ou correção elástica; a leitura da direção usa um trecho maior da rota para distribuir a mudança de ângulo.

As comboboxes que precisam abrir para cima preservam essa orientação durante todo o fechamento. A classe de posicionamento é removida somente depois da transição de opacidade e escala, evitando que o menu reapareça abaixo do campo no último quadro.

Na versão 55, cada painel permanece totalmente imóvel até o encaixe dos garfos. A elevação altera somente a escala dos garfos e do painel, nunca a carroceria da empilhadeira. Distâncias e curvas da manobra passam a ser proporcionais à viewport para manter a cena legível também no celular.

Na versão 59, o hero móvel apresenta primeiro a mensagem comercial e faz um crossfade curto para a fábrica, liberando a viewport inteira para o carregamento em larguras de 360 a 430 px. O caminhão já é carregado exatamente no ponto inicial e sobre o eixo da estrada; ao terminar, somente fábrica e empilhadeira desaparecem enquanto a estrada surge, sem qualquer reposicionamento do veículo. A empilhadeira móvel usa 58% da escala-base e permanece claramente menor que o caminhão. A elevação e a rotação da carga foram distribuídas por uma faixa maior de scroll para reduzir mudanças abruptas. O rodapé inclui o crédito de desenvolvimento com link para `@rafaelstork.dzn` no Instagram.
