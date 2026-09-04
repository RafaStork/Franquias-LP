# Opção 09 — Bosque de copas amplas

Atualização 108: por escolha do usuário, as clareiras internas retornam à distribuição seletiva da revisão 106. Somente as laterais da tela são preenchidas continuamente com copas escuras parcialmente recortadas pelo viewport. A reserva para a estrada e para o conteúdo tem prioridade sobre esse preenchimento. Não girar as quatro variantes com galhos.

Atualização 107: a camada posterior agora é contínua e sobreposta, sem exclusão dos centros cobertos pela frente. Isso fecha os vazios entre copas recortadas. Na periferia, o raio se adapta às áreas protegidas. Sem filtros ou novas imagens. Verificação de cobertura sobre o SVG renderizado disponível em `tests/forest-coverage.test.cjs`.

Revisão 106: a opção escolhida permanece em vetores nativos, conforme solicitado. A versão em produção está nos oito `<symbol id="forest-09-…">` de `index.html`, instanciados por `<use>` em `app.js`. São formas planas, galhos em ocre e três camadas de copas. Não há bitmaps, máscaras, filtros de remoção de fundo ou dependências externas na floresta.

Símbolos 1, 2, 5 e 6: quatro árvores dominantes com galhos visíveis, sempre em pé e sem rotação. Símbolos 3 e 4: folhagem intermediária. Símbolos 7 e 8: árvores mais escuras em último plano, preenchendo os vazios sem encobrir as camadas superiores. A geometria reserva folga para estrada, textos e fotos.

A versão anterior usava WebPs com fundo claro e filtro por instância. Os arquivos antigos foram preservados como histórico, mas não são mais requisitados pela página. A distribuição usa copas maiores, menos instâncias, cache por geometria e geração adiada para não bloquear a primeira renderização. A estrada continua com a mesma geometria e estética.

## Histórico — prompt da versão raster substituída

Use case: stylized-concept.
Asset type: a single transparent 2 by 2 sprite atlas for a stylized overhead forest website scene, approximately 1024 by 1024 pixels.
Input image 1 is a STYLE REFERENCE BOARD ONLY. Faithfully derive ONLY the BOTTOM LEFT panel labeled "09 · Bosque de copas amplas". Ignore every other panel completely. Do not reproduce the board.
Primary request: exactly four isolated tree sprites on genuine transparent alpha, one fully contained in each equal quadrant. Top left and top right: two slightly different mature broadleaf trees matching option 09, with broad rounded scalloped green foliage pads around a prominently visible clean golden-brown trunk and branching network. These are simple broad branching trees with open gaps between large rounded foliage clusters; branch design and simplification must closely match option 09, not the more intricate foliage of option 01 or the mixed conifers of option 10. Bottom left and bottom right: two smaller dark-green understory broadleaf canopies, completely closed foliage with no visible branches or trunk, matching the dark understory beneath the option 09 trees.
Style: simplified clean hand-drawn flat cel-shaded green illustration, organic rounded scalloped outlines, broad foliage masses, restrained dark-green outlines and subtle simple interior foliage marks. Flat shapes and broad branch forms, not realistic detailed trees. Color palette from option 09: medium olive green foliage, deep forest green understory, warm golden-brown branching.
Composition: 2x2 grid with no grid lines. Each sprite centered respectively at 25%/25%, 75%/25%, 25%/75%, and 75%/75%. Leave ample fully transparent empty margin inside every quadrant and around the outer edge. Every full tree completely visible and uncropped; no sprite may cross the center dividing lines or touch another sprite. Top sprites broader and larger mature canopy trees; bottom sprites smaller bushy canopies.
Background: genuinely transparent alpha, no paper, no white backdrop, no checkerboard pattern, no ground or shadows extending beyond a sprite.
Absolutely no road, truck, text, labels, numbers, framing, other objects, pine trees, cedar trees, needle foliage, realistic fine leaves, photorealism, or 3D. ONE atlas image only.
