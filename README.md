# Landing page de franquias — 321 Modular

Site estático e sem etapa de build, preparado para rodar diretamente no GitHub Pages.

## Revisão V0.0.117

- Caixa de “A oportunidade” novamente contida na largura central da seção, sem margem negativa: o recuo direito acompanha o esquerdo do título.
- As duas caixas usam vidro verde mais claro, próximo ao cabeçalho, com desfoque e reflexo estático preservados. Numeração clara para legibilidade.
- No celular, faixa de 340–560 px entre título e caixa, dedicada à foto do chalé. A foto acompanha a altura real do título e é enquadrada nessa faixa, sem ampliar para a altura total da seção. Desktop preserva a foto de fundo original.
- Validação automatizada de conteúdo, contraste e regressões; sem teste visual em navegador nesta revisão.

## Revisão V0.0.116

- Texto de apoio de “A oportunidade” em caixa liquid glass de até 340 px, alinhada à direita e aproveitando a margem externa em desktop para reduzir a cobertura do chalé. Fotografia, enquadramento e trajeto preservados. Em mobile mantém largura legível dentro do corredor existente; não há garantia de separação completa da foto em todos os recortes.
- Caixa e perfil do franqueado compartilham acabamento inspirado no cabeçalho: desfoque de 28 px, saturação de 145%, borda suave, reflexo estático e sombras internas. Gradiente neutro preserva a preferência por cinza; numeração mais clara para contraste. Sem brilho animado e sem as linhas externas dos itens.
- Validação automatizada de conteúdo, contraste e regressões de trajeto/florestas; sem teste visual em navegador nesta revisão.

## Revisão V0.0.115

- Card maior: Lucas Rabelo, Palhoça-SC e Araranguá-SC. Cards menores: Lucas Miranda, Ribeirão Preto-SP; Tiago, Blumenau-SC. Iniciais dos avatares atualizadas; depoimentos mantidos como exemplos pendentes de confirmação.
- Depoimentos, identificação e etiquetas dos cards incluídos nas áreas protegidas da floresta, com a margem de segurança existente de 10 px. Árvores continuam permitidas nas bordas decorativas, sem bloquear todo o card. Identificação pode quebrar linhas em telas estreitas.
- Perfil do franqueado: vidro fosco neutro, desfoque de 20 px, base com opacidade de 66% e reflexo estático discreto. Removidas as linhas externas superior/inferior, preservadas as três divisórias internas. Sem iluminação animada; contraste calculado com a sobreposição existente da seção.
- Validação automatizada de conteúdo, proteção geométrica e regressões; sem teste visual em navegador nesta revisão.

## Revisão V0.0.114

- Fundo da lista do perfil do franqueado em cinza neutro (RGB 18/18/18), com opacidade reduzida de 78% para 74%; preservados os cantos arredondados e o contraste dos textos.
- Removidos, conforme solicitado, o aviso abaixo da comparação e o aviso visual de conteúdo provisório dos depoimentos. Os nomes e depoimentos continuam sendo exemplos para aprovação, pendentes de substituição por informações reais antes da publicação comercial.
- Validação automatizada de conteúdo, contraste e regressões da animação; sem teste visual em navegador nesta revisão.

## Revisão V0.0.113

- “A oportunidade”: passagem reta junto à lateral esquerda do chalé/deck, conforme a linha indicada na referência. O centro da estrada usa a projeção do chalé na foto, com folga lateral para o caminhão; removido o zigue-zague da V0.0.112. No recorte móvel permanece o corredor lateral reservado, sem saída da tela.
- Título reduzido e com largura menor em desktop/tablet para abrir espaço real à estrada. Tipografia ajustada ao próprio bloco por unidades de container; texto de apoio permanece na coluna direita. Imagem, `cover` e posição `57% 56%` preservados.
- Curvas de aproximação/retorno distribuídas por faixas vazias ampliadas no fim de “40 anos” e início de “Um negócio com método”. As âncoras foram afastadas do texto e a passagem na foto não tem mudança lateral interna.
- Validação: 33 cenários geométricos responsivos, referência de x≈765, regressões de conteúdo, carga dupla e florestas. Sem teste visual em navegador nesta revisão.

## Revisão V0.0.112

- Desvio em “A oportunidade” limitado ao corredor visível e a um pequeno deslocamento lateral apenas na altura do chalé, com retorno à faixa original. Removida a possibilidade de sair da tela. Foto, enquadramento e textos preservados. Em recortes apertados, manter o caminhão visível prevalece sobre afastá-lo completamente da área fotográfica do chalé; não há alegação de ausência de sobreposição em todos os recortes.
- Carregamento: os dois painéis formam uma carga rígida desde a origem, compartilham posição relativa, rotação e elevação, e são depositados juntos nas duas posições originais da carroceria. Eliminada a segunda viagem e sua curva de transferência. A retirada individual dos painéis pelo munck na montagem permanece inalterada.
- Scroll do carregamento reduzido de 1020 para 620 svh no desktop e de 1080 para 680 svh no celular (aproximadamente 40% menos percurso). O ciclo único ocupa mais tempo proporcional e termina antes da saída gradual do caminhão.
- Validação automatizada de sintaxe, conteúdo, limites do desvio em 30 cenários, geometria rígida da carga em escalas/ângulos variados, florestas e tamanho dos arquivos. Sem teste em navegador nesta revisão.

## Revisão V0.0.111

- “A oportunidade”: restauração da foto de fundo de toda a seção, `cover`, enquadramento original `57% 56%`, sobreposição e tipografia anteriores. Removido o painel lateral introduzido na V0.0.109.
- A estrada agora escolhe uma lateral livre considerando a projeção dos chalés no recorte real da foto e os blocos de texto. O cálculo reserva o raio completo do caminhão, incluindo sua rotação. As curvas de aproximação e retorno terminam fora da zona protegida; não há troca de caminhão ou ocultação por opacidade.
- Quando o recorte estreito e o texto não deixam uma faixa visível livre, a estrada contorna temporariamente pela lateral externa da tela e retorna. A imagem não é movida para abrir espaço.
- Teste geométrico do desvio em 30 combinações de largura/altura, além das regressões de conteúdo e florestas; sem validação em navegador nesta revisão.

## Revisão V0.0.110

- Expansão generativa da foto do FAQ para cima, com céu contínuo atrás do texto. Uma única imagem cobre o painel; não há mais divisão entre bloco sólido e fotografia. A composição reserva 35% da altura para o chalé e mantém o texto acima, com escurecimento contínuo para contraste.
- Perfil do franqueado: opacidade do fundo reduzida de 92% para 78%, cantos de 18px. Contraste do texto branco e dos números validado considerando até uma fotografia totalmente branca por baixo.
- Nova imagem em WebP local: 600 px / 48.122 bytes e 992 px / 108.676 bytes. Originais anteriores preservados. Expansão criada com a ferramenta integrada imagegen, sem CLI/API externa; prompt em `assets/chale-faq-expandido-prompt.md`.
- Validação de código, referências, contraste e geometria automatizada. Imagem gerada inspecionada visualmente; sem teste em navegador nesta revisão.

## Revisão V0.0.109

- Florestas: a distribuição irregular das três camadas continua além do recorte horizontal, sem fileiras especiais ou faixas escuras nas bordas. Copas com galhos permanecem verticais; pequenas clareiras internas foram preservadas.
- FAQ: texto e fotografia ocupam áreas consecutivas no mesmo painel. A foto mantém sua proporção original, sem texto cobrindo o chalé e sem quebra dentro de “expansão”.
- Oportunidade: fotografia limitada à primeira coluna, fora do corredor reservado ao caminhão; entrada e saída da seção com proteção visual.
- Textos de apoio com tipografia maior, peso intermediário e cores de maior contraste. Lista do perfil do franqueado com base escura independente da fotografia, texto branco e números claros.
- Validação: sintaxe JavaScript, referências locais, CSS, geometria em nove larguras simuladas (320–1920 px), cobertura vetorial rasterizada em quatro larguras e orçamento de instâncias. Sem validação visual em navegador/dispositivos reais nesta revisão.

## Cópias de versão

Ao finalizar e validar alterações, salvar a revisão com `../save-version.ps1 -Version V0.0.109`, ajustando o número da versão.
Destino: `C:\⬜ PROJETOS IA\⬜ SUPERAPP IA\VERSIONS\LANDING PAGE FRANQUIAS`.
Formato: `LANDING PAGE FRANQUIAS (V0.0.108) 2026-09-04 07-55.zip`, com prefixo V, três números e data/hora de São Paulo. A revisão 108 corresponde a V0.0.108; o próximo ajuste será V0.0.109. O ZIP contém os arquivos da LP na raiz, incluindo `.nojekyll`. O script confere a quantidade e os hashes SHA-256 dos arquivos e não sobrescreve versões existentes. Extrair o ZIP para restaurar ou publicar no GitHub Pages.

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

As fotografias da seção Chalés estão salvas localmente em WebP, com variantes `assets/chale-instagram-0N-800.webp` e `assets/chale-instagram-0N-1600.webp`. A largura máxima respeita o arquivo original, sem ampliação artificial. A página não depende do Instagram para exibi-las. O grid reserva uma coluna central exclusiva para a passagem do caminhão.

## Atualização editorial — setembro de 2026

- A seção Empresa, antes da Oportunidade, apresenta a experiência do Grupo Pacheco desde 1985, conforme a história publicada em https://321modular.com/. Os 40+ anos se referem a essa trajetória, não à idade da marca de franquias.
- Fotos fornecidas: `BRH_1796.jpg` (equipe), `DJI_0965.JPG` (estrutura industrial) e `BRH_2731.jpg` (chalé no FAQ). São servidas como WebP local, em versões responsivas, com dimensões reservadas e carregamento tardio.
- Oportunidade ganha fundo fotográfico com proteção de contraste. O comparativo destaca os símbolos × e ✓, sem alterar seu corredor central.
- FAQ: investimento a partir de R$ 380 mil, implantação estimada de 90 dias e payback estimado de 12 meses, conforme informações fornecidas pelo responsável em 03/09/2026. Confirmar composição, premissas e condições na COF antes de divulgar comercialmente; não apresentar projeção de retorno como garantia.
- A jornada inclui o Contrato de franquia após a COF e antes da implantação. O formulário pergunta a origem dos recursos e o envolvimento na operação; os nomes dos campos são `recurso_investimento` e `envolvimento_operacao`.
- A rota inclui Empresa. As árvores usam quatro copas transparentes distintas, em grupos mais densos nas transições. A geometria rejeita posições sobre estrada, textos, fotos e controles; permite somente leve sobreposição entre copas. Um observador de dimensões recalcula a rota quando seções mudam de altura, inclusive ao abrir o FAQ.
- Verificação estática: `node --check app.js` e `node tests/content.test.cjs`. O teste geométrico não substitui uma revisão visual em navegadores reais.

### Revisão 108 — Clareiras internas, laterais preenchidas e FAQ mais largo

- Restaurado o preenchimento seletivo da revisão 106 para manter espaços entre as copas. Árvores de frente continuam em pé, com quatro variantes.
- As laterais recebem uma faixa de copas escuras parcialmente fora da tela. Recorte vetorial no limite do viewport evita transbordamento horizontal; as reservas da estrada e do conteúdo continuam obrigatórias.
- Teste de cobertura atualizado: agora espera clareiras internas e verifica que ambas as bordas estejam preenchidas nas cenas isoladas de 390, 768, 1.440 e 1.920 px. Orçamento preservado: 1.875 instâncias na simulação de dez transições a 1.920 px.
- No desktop, a grade do FAQ amplia a coluna da foto sem diminuir o corredor reservado. Título dimensionado pelo espaço interno do bloco, sem hifenização ou quebra no meio de palavras; “expansão.” recebe proteção explícita de linha.
- Sintaxe, conteúdo, geometria, cache e cobertura passaram; prévia dos vetores inspecionada separadamente, sem teste de layout em navegador.

### Revisão 107 — Floresta sem frestas, FAQ fotográfico e cabeçalho

- Sub-bosque escuro contínuo, com copas sobrepostas inclusive sob os centros das árvores da frente. A antiga exclusão por centro deixava vazios entre as bordas lobadas. Árvores da borda encolhem para preservar a estrada e as áreas protegidas.
- `tests/forest-coverage.test.cjs` renderiza os SVGs reais e busca vazios internos por pixels transparentes: nenhum buraco acima de quatro pixels nas quatro cenas de teste (390, 768, 1.440 e 1.920 px). Não é teste de layout no navegador.
- Mantido o orçamento do teste isolado de desempenho: 1.902 instâncias em dez transições de 1.920 px, sem filtros ou buscas nativas no trajeto.
- Foto existente do FAQ ocupa todo o fundo da coluna introdutória, atrás do título, etiqueta e descrição. Overlay verde-escuro, texto branco e etiqueta clara; contraste mínimo calculado de 4,5:1 mesmo sobre o pixel mais claro. Altura flexível e ajustes móveis; perguntas continuam na coluna própria.
- Removidos o feixe periódico e o deslocamento de reflexos do cabeçalho. Transparência, desfoque e acabamento estático de vidro permanecem.

### Revisão 106 — Orientação, variantes e profundidade da floresta

- Árvores com galhos sempre em pé, sem rotação. Quatro desenhos distintos de copa e ramificação (símbolos 1, 2, 5 e 6), com variação de tamanho.
- Árvores da etapa final de montagem usam os mesmos vetores, em três variantes distintas e sem giro, mantendo os centros originais no terreno e acompanhando o zoom existente. A cena alternativa também reutiliza os símbolos.
- Nova camada posterior de árvores verde-escuras (7 e 8), colocadas nos vazios e atrás das camadas existentes. Cada árvore de fundo é um único caminho SVG; sem filtros, bitmaps ou novas requisições.
- Folgas da estrada, textos e fotos preservadas. Cache e geração adiada mantidos. Simulação de dez transições: 740 instâncias em 390 px e 1.675 em 1.920 px, abaixo do orçamento de 2.000 do teste e das 3.183 imagens filtradas anteriores à revisão 105.
- Verificações de orientação, variantes, ordem de camadas, preenchimento adicional, limites da estrada e cache passaram. Inspeção de prévia vetorial isolada, não de layout no navegador.

### Revisão 105 — Floresta vetorial e carregamento

- Floresta 09 em quatro símbolos SVG nativos compartilhados, sem imagens recortadas nem filtros por árvore. As copas maiores reduzem o número de instâncias, preservando as camadas e o preenchimento horizontal.
- Geração decorativa adiada, cache de geometria, colisões limitadas à transição relevante e avaliação matemática das curvas. O trajeto e a animação do caminhão não foram alterados.
- Fonte variável convertida sem subconjuntos para WOFF2: 744.936 → 215.968 bytes (71% menor). Preload e CSS apontam para a mesma cópia local. Original preservada.
- Mapa de 474.540 bytes passa a usar carregamento adiado e dimensões explícitas. Fotos já usam WebP e carregamento adiado; arquivos antigos sem referências não são transferidos pela página.
- Em dez transições livres de 550 px simuladas, 390 px: 1.501 → 565 instâncias; 1.920 px: 3.183 → 1.202. Buscas na geometria SVG para gerar a floresta: 1.000 → zero. Esses números são do teste isolado, não uma medição de carregamento no navegador.
- Validação: `node --check app.js`, `node tests/content.test.cjs`, `node tests/forest-performance.test.cjs`. Prévia dos vetores renderizada separadamente para inspeção; sem testes visuais de navegador nesta revisão.

### Revisão visual 104 — Opção 09 aprovada (substituída pela 105)

- Bosque em duas camadas: preenchimento inferior escuro e árvores dominantes com copas maiores e galhos visíveis, derivadas da opção 09 escolhida na prancha. Não altera fotos, textos, cores da tabela ou trajeto do caminhão.
- Quatro imagens de 256 px, aproximadamente 51 KiB no total. Detalhes do filtro de transparência e prompt: `assets/forest-09-art-direction.md`.
- Testes estáticos verificam as duas camadas, a ordem de desenho, hierarquia de tamanhos, preenchimento horizontal e folga da estrada nas nove larguras simuladas. Sem revisão visual de navegador nesta alteração.

### Revisão visual 103 — 03/09/2026

- Fotos de Empresa e FAQ retornam à composição da revisão 101, sem máscaras de transparência nas bordas, com legenda sobreposta à própria imagem. A coluna vermelha do comparativo foi preservada.
- Perfil recebe como fundo a imagem fornecida `SAVE_20260903_170158.jpg.jpeg`, compactada em WebPs de 800 e 1600 px (aproximadamente 228 KiB somados). Original intacto fora da pasta publicada. Camada escura mantém contraste do conteúdo.
- Árvores ilustradas com ramificações visíveis substituem os símbolos abstratos. Menor espaçamento e maior sobreposição de copas deixam os grupos mais densos; recorte das margens transparentes permite maior cobertura. Quatro arquivos somam aproximadamente 60 KiB; prompt em `assets/forest-illustrated-art-direction.md`.
- Testes estáticos cobrem referências, ausência das máscaras rejeitadas e aumento mínimo de 30% no número de árvores em uma faixa livre simulada nas nove larguras. Não são testes visuais em dispositivos.

### Revisão visual 102 — 03/09/2026

- Árvores substituídas por quatro símbolos gráficos de poucos planos, sem folhagem detalhada. A distribuição agora varre toda a largura livre entre as seções, não apenas uma faixa ao lado da estrada. Imagens WebP com transparência: aproximadamente 24 KB somadas; prompt em `assets/forest-flat-art-direction.md`.
- Fotografias de Empresa e FAQ com transições de transparência nas bordas, integradas ao fundo; legendas fora da fotografia, sem faixas escuras nem sobreposição sobre as pessoas. Arquivos originais preservados.
- Todas as células de Obra convencional usam o mesmo fundo vermelho suave do cabeçalho (`#f3e3d9`), inclusive os blocos equivalentes no celular.
- Testes estáticos incluem distribuição horizontal de florestas em uma transição simulada para nove larguras. Não equivalem a testes visuais em dispositivos.

### Revisão visual 101 — 03/09/2026

- Fotos dos 40 anos em composição contínua, sem cartões arredondados, com legendas sobre as imagens e corredor do caminhão preservado.
- Fundo de Oportunidade substituído por `SAVE_20260903_162950 (2).jpg.jpeg`; FAQ substituído por `SAVE_20260903_164010.jpg.jpeg`, conforme a atualização do pedido. As fontes ficam fora da pasta publicada, intactas. WebPs responsivos: `chale-sistema-*` e `chale-faq-*`, cerca de 386 KB somando as quatro versões, contra 17,56 MB das duas fontes.
- Os símbolos × e ✓ estão nas colunas da tabela, não em cartões separados. No celular, os rótulos dos métodos acompanham cada critério.
- Texto sobre turismo reduzido a uma chamada destacada e uma frase de apoio, mantendo moradia e lazer como usos do sistema.
- Arte das árvores gerada uma vez pela ferramenta integrada e otimizada para quatro WebPs com transparência, aproximadamente 43 KB no total. Prompt e arquivos documentados em `assets/forest-art-direction.md`.
- Validação desta revisão: sintaxe, referências locais, estrutura e proteção geométrica em nove larguras; sem testes visuais de navegador.

Na saída da fábrica, cada painel agora é movimentado pela empilhadeira em seis momentos legíveis — aproximação vazia, encaixe dos garfos, elevação, transporte, descida e recuo. A aproximação acontece por uma curva própria, com esterçamento visível; entre os dois painéis, o equipamento se afasta pela lateral e contorna a carga antes de alinhar novamente. Empilhadeira, garfos e painel formam um conjunto cinemático: a carga gira com o equipamento durante as curvas e retorna progressivamente ao alinhamento da carroceria na aproximação final. O painel recebe zoom progressivo e sombra mais distante durante a subida, retornando à escala normal quando é apoiado. A empilhadeira fica em uma camada abaixo da carroceria e dos painéis, fazendo os garfos parecerem encaixados sob a carga. O capítulo da fábrica ocupa três viewports, oferecendo mais de duas vezes o percurso de rolagem da versão anterior. A estrada permanece invisível durante a operação e surge em crossfade somente depois do segundo painel estar assentado, enquanto a fábrica e a empilhadeira desaparecem. Nas curvas, o caminhão volta a apontar diretamente para a tangente da estrada, sem atraso ou correção elástica; a leitura da direção usa um trecho maior da rota para distribuir a mudança de ângulo.

As comboboxes que precisam abrir para cima preservam essa orientação durante todo o fechamento. A classe de posicionamento é removida somente depois da transição de opacidade e escala, evitando que o menu reapareça abaixo do campo no último quadro.

Na versão 55, cada painel permanece totalmente imóvel até o encaixe dos garfos. A elevação altera somente a escala dos garfos e do painel, nunca a carroceria da empilhadeira. Distâncias e curvas da manobra passam a ser proporcionais à viewport para manter a cena legível também no celular.

Na versão 59, o hero móvel apresenta primeiro a mensagem comercial e faz um crossfade curto para a fábrica, liberando a viewport inteira para o carregamento em larguras de 360 a 430 px. O caminhão já é carregado exatamente no ponto inicial e sobre o eixo da estrada; ao terminar, somente fábrica e empilhadeira desaparecem enquanto a estrada surge, sem qualquer reposicionamento do veículo. A empilhadeira móvel usa 58% da escala-base e permanece claramente menor que o caminhão. A elevação e a rotação da carga foram distribuídas por uma faixa maior de scroll para reduzir mudanças abruptas. O rodapé inclui o crédito de desenvolvimento com link para `@rafaelstork.dzn` no Instagram.

Na versão 60, os alvos de montagem deixam de depender de coordenadas presumidas entre duas camadas. A posição real da fundação é convertida para o sistema do munck em cada quadro, incluindo diferenças de escala, rotação e deslocamento causadas pela viewport visual de navegadores móveis.

Na versão 61, a prova social ganha uma seção própria entre Chalés e Processo. Três cards demonstrativos apresentam nome, região, tema e depoimento do franqueado, com aviso explícito de conteúdo provisório até a aprovação dos relatos reais. O grid mantém um corredor central vazio em desktop e tablet e uma faixa lateral livre no celular; a rota dinâmica passa por esse espaço sem atravessar os depoimentos.

Na versão 62, a carroceria, o garfo e os painéis passam a ocupar três camadas independentes. A ordem de profundidade durante o carregamento é caminhão, garfo e módulo, respectivamente; a empilhadeira permanece acima do conjunto para preservar a leitura da cabine e do mastro. A camada dos painéis replica exatamente posição, escala, rotação, zoom e opacidade do caminhão, evitando qualquer deslocamento entre carga e carroceria.

Na versão 63, a rota geral e o acesso ao terreno compartilham o mesmo material visual: faixa verde translúcida, eixo tracejado amarelo e trecho percorrido laranja. Largura, cores e espaçamento dos traços são copiados em tempo real da estrada geral para o SVG do terreno, incluindo as variações responsivas. A superfície opaca e o tracejado cinza do terreno foram removidos. No ponto de encontro, as duas camadas fazem um crossfade complementar enquanto o progresso laranja continua pelo novo caminho, evitando a emenda escura causada pela sobreposição anterior.

Na versão 64, a estrada do terreno começa a aparecer antes de o caminhão alcançar a emenda, com estilo e largura já sincronizados. O último trecho da rota geral converge progressivamente para a tangente exata do acesso ao terreno, eliminando a mudança brusca de direção. O carregamento ocupa 4,2 viewports em telas maiores e 4,6 no celular; aproximação, contato, elevação, transporte, descida e recuo receberam intervalos mais longos. A empilhadeira passa a mostrar esterçamento, banda de rodagem em movimento, leve oscilação da carroceria e inclinação nas curvas. O galpão e seus elementos internos compartilham uma área ampliada e alinhada, incluindo uma composição móvel de 110% da largura por 66% da altura da tela.

Na versão 65, a direção do caminhão deixa de receber qualquer rotação artificial na emenda: posição e orientação passam a vir da mesma tangente local da curva, com amostragem curta junto ao ponto de encontro. Assim o veículo não gira enquanto ainda se desloca lateralmente e entra no acesso do terreno como continuação física da estrada geral. A empilhadeira passa a usar cinemática de eixo traseiro diretor. O ponto de ancoragem visual fica no centro do eixo dianteiro, a carroceria acompanha a tangente da trajetória desse eixo e as duas rodas traseiras recebem ângulos interno e externo calculados pela curvatura do percurso; as rodas dianteiras permanecem paralelas ao chassi. A traseira agora descreve o arco natural oposto ao esterçamento, em vez de todo o equipamento deslizar de lado.

Na versão 66, painel, garfos, eixo dianteiro e rodas passam a derivar da mesma trajetória cúbica. Os dois módulos permanecem imóveis durante aproximação, encaixe e elevação e só começam a viajar quando os garfos já estão conectados. Depois de apoiar o primeiro módulo, a empilhadeira recua por uma curva contínua, para alinhada diante do segundo e avança novamente; ela não atravessa o caminhão nem abandona os limites do galpão. A direção da carroceria vem diretamente da tangente dessa trajetória, enquanto o esterçamento traseiro considera também o sentido de marcha, inclusive durante a ré. O percurso dos painéis foi redesenhado com tangentes horizontais no início e no fim para preservar o contato dos garfos durante toda a operação.

Na versão 67, o alcance físico dos garfos acompanha encaixe e elevação. O eixo dianteiro recua exatamente o quanto o conjunto de garfos se estende, mantendo a ponta sob o módulo durante aproximação, transporte e deposição, sem atravessar a carroceria do caminhão. A escala intermediária da empilhadeira também foi reduzida para preservar proporção e área de manobra em tablets, mantendo as mesmas relações geométricas da versão desktop e móvel.

Na versão 68, os garfos deixam de alterar comprimento durante o encaixe. O zoom de elevação é ancorado diretamente no mastro, eliminando qualquer vão entre garfo e empilhadeira, e o ponto de apoio do módulo usa exatamente a mesma variação de escala. Os painéis de preparação foram afastados e o retorno entre as cargas virou uma manobra em duas etapas: ré até uma área livre à esquerda, parada para troca de marcha e avanço até o segundo alinhamento. Assim a carroceria não atravessa o módulo que permanece no piso. O capítulo da fábrica passa de 420 para 600 viewports relativas no desktop e de 460 para 640 no celular, reduzindo em aproximadamente um terço a velocidade percebida de toda a operação.

Na versão 69, o segundo painel recebe mais 60 unidades de afastamento transversal, criando uma faixa de segurança real entre ele e a carroceria durante o primeiro carregamento e a manobra de retorno. O capítulo da fábrica é ampliado novamente para 680 viewports relativas no desktop e 720 no celular; cada carregamento passa a exigir mais de duas alturas completas de tela, tornando aproximação, elevação, transporte e deposição claramente legíveis.

Na versão 70, a margem transversal do painel em espera é ampliada novamente após a validação em 390 px de largura. A caixa completa da empilhadeira, incluindo rodas e contrapeso, mantém uma folga visível do módulo estacionado mesmo no quadro de maior aproximação do primeiro ciclo.
