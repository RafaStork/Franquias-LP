# Árvores das transições

Criadas com a ferramenta integrada de geração de imagens (uma geração, sem CLI/API e sem novas tentativas). Atlas separado em quatro WebPs transparentes de 192 × 192; total aproximado de 43 KB. Consumidos em `app.js`, com variação determinística de tamanho, rotação e distância, protegendo texto e estrada.

Arquivos finais: `tree-canopy-1.webp`, `tree-canopy-2.webp`, `tree-canopy-3.webp`, `tree-canopy-4.webp` nesta pasta.

## Prompt utilizado

Use case: stylized-concept
Asset type: One transparent PNG sprite sheet for a polished flat 2D top-down website scene.
Primary request: Generate exactly four distinct recognizable stylized tree canopies, seen EXACTLY straight down from overhead, on a precisely spaced 2 by 2 grid. Square canvas, 1024 by 1024 pixels or comparable square resolution.
Composition: Each tree centered in its own equal quadrant (centers at 25%/25%, 75%/25%, 25%/75%, 75%/75%). Each entire tree silhouette fits comfortably within a 34%-wide and 34%-high region, leaving generous fully transparent margins between trees and around all edges. No overlap between quadrants. Four separate extractable sprites, all at similar visual scale.
Subjects: Upper left: broadleaf tree canopy with clearly shaped irregular lobes. Upper right: conifer viewed from the very top, a narrow pointed starburst of layered needles radiating from its center, NOT a side-view triangle. Lower left: irregular asymmetric multi-lobed deciduous canopy. Lower right: rounded layered canopy with organic scalloped edges and a few overlapping foliage clusters.
Style: polished simple 2D vector-like illustration, crisp clean silhouettes, 3 to 4 clear broad flat color layers per tree, restrained subtle self-shadowing within the foliage, recognizable botanical silhouettes, designed to match a flat top-down orange truck driving along a green road on offwhite or dark forest backgrounds.
Color palette: #4f7747, #83a878, #1f331b, #628852. Use only these greens and closely related antialiased edge colors.
Background: genuine fully transparent alpha channel, all empty areas transparent. No painted background, no white rectangle, no visible checkerboard.
Avoid: photorealism, isometric perspective, oblique camera angles, side-view trees, visible side trunks, ground planes, circles-only lollipop trees, elaborate texture, gradients, text, labels, borders, grid lines, watermarks. No objects except the four tree canopies.
The exact overhead view is essential.
