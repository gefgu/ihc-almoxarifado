# Sistema Visual UTFPR para Protótipos

## 1. Propósito

Este documento descreve a linguagem visual adotada no protótipo de Almoxarifado e serve como referência para futuras páginas do projeto.

O sistema é inspirado na interface móvel da UTFPR fornecida como referência: fundos escuros, amarelo como destaque institucional, roxo em elementos estruturais e grafismos acadêmicos discretos. Ele não substitui nem pretende reproduzir o manual oficial de identidade visual da UTFPR.

## 2. Princípios

1. **Institucional e direto:** a interface deve parecer parte do ecossistema acadêmico sem comprometer a clareza das tarefas.
2. **Contraste como hierarquia:** amarelo indica seleção e ação principal; roxo identifica categorias e blocos de apoio.
3. **Mobile first:** componentes devem funcionar a partir de 320 px e oferecer áreas de toque confortáveis.
4. **Informação antes de decoração:** grafismos de fundo devem ter baixa opacidade e nunca competir com o conteúdo.
5. **Consistência:** novas páginas devem reutilizar tokens, raios, espaçamentos e estados antes de criar variações.

## 3. Tokens

### Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-charcoal` | `#1B1B1B` | Cabeçalho, navegação, drawer e fundos profundos |
| `--color-surface` | `#292929` | Fundo principal |
| `--color-surface-raised` | `#353535` | Cards e superfícies elevadas |
| `--color-yellow` | `#FFC800` | Ações primárias, seleção e foco |
| `--color-yellow-soft` | `#F6D767` | Hover de ações amarelas |
| `--color-purple` | `#72469B` | Categorias, imagens abstratas e seções |
| `--color-purple-dark` | `#573276` | Variações e estados pressionados |
| `--color-text` | `#F7F7F4` | Texto principal sobre fundo escuro |
| `--color-muted` | `#B9B9B3` | Metadados e texto secundário |
| `--color-success` | `#71C99B` | Disponibilidade e sucesso |

O amarelo não deve ser usado em grandes áreas de leitura. Em superfícies amarelas, use texto quase preto (`#171717`).

### Tipografia

- Família: `Inter`, seguida pela pilha de fontes do sistema.
- Título de página: 20 px, peso 900.
- Título de seção: 16 px, peso 800.
- Título de card: 15–16 px, peso 800.
- Corpo: 12–14 px, peso 400–600.
- Metadados: 10–11 px, peso 600–800.
- Rótulos institucionais podem usar caixa alta e espaçamento entre letras de `0.08em` a `0.24em`.

### Espaçamento

Use uma escala baseada em 4 px:

- `4 px`: separação interna mínima.
- `8 px`: itens relacionados.
- `12 px`: controles compactos.
- `16 px`: padding padrão de cards.
- `20–24 px`: separação entre seções e margem de página.
- Margem horizontal da página: `clamp(16px, 5vw, 24px)`.

### Raios e sombras

- Controles compactos: `10 px`.
- Cards e campos: `16 px`.
- Cabeçalhos, drawers e navegação: `24 px`.
- Cards usam sombra escura difusa; botões primários podem usar sombra amarela suave.
- Bordas em fundos escuros usam branco com 12% de opacidade.

### Ícones

- Biblioteca padrão: Lucide.
- Tamanho comum: 20 px; destaques podem usar 24–32 px.
- Use traço e tamanho consistentes dentro do mesmo componente.
- Ícones decorativos devem ter `aria-hidden="true"`.
- Botões somente com ícone precisam de `aria-label`.

## 4. Componentes

### Cabeçalho

- Fundo carvão e cantos inferiores de 24 px.
- Marca centralizada, controles circulares com área mínima de 44 × 44 px.
- Título, subtítulo e contexto do campus formam uma única hierarquia central.

### Marca UTFPR

- O arquivo oficial está em `aluno/assets/logo-utfpr.png`, exibido sobre uma placa clara (a marca oficial usa traço escuro, ilegível direto sobre o fundo carvão).
- A imagem deve preservar proporção, possuir texto alternativo e usar `object-fit: contain`.
- Enquanto o asset não existir ou falhar, exibir o fallback tipográfico `UTFPR`.
- O fallback é apenas temporário e não deve ser exportado como substituto oficial da marca.

### Cards

- Fundo em gradiente sutil entre `#353535` e `#1B1B1B`.
- Borda branca translúcida e sombra escura.
- Categoria em amarelo e imagem abstrata ou ícone em bloco roxo.
- Informações mais importantes aparecem primeiro; código e estoque são metadados.

### Campos e busca

- Altura mínima de 50 px.
- Fundo carvão, borda translúcida e texto claro.
- No foco, a borda assume amarelo e o outline permanece visível.
- Placeholder usa cinza com contraste suficiente, mas inferior ao conteúdo digitado.

### Filtros

- Chips arredondados com altura mínima de 42 px.
- Inativos: fundo carvão e texto cinza-claro.
- Ativo: fundo amarelo, texto escuro e `aria-pressed="true"`.
- Em telas estreitas, a lista pode rolar horizontalmente sem exibir scrollbar.

### Botões

- Primário: amarelo, texto escuro, peso 900.
- Secundário: fundo transparente ou carvão com borda translúcida.
- Botões devem ter ao menos 44 px de área de toque, salvo ações compactas inseridas em cards, que nunca devem ter menos de 38 px de altura.
- O estado pressionado pode reduzir a escala para 97%.

### Badges

- Use badges apenas para estados curtos.
- Sucesso: verde claro com fundo verde translúcido.
- Evite comunicar estado somente pela cor; mantenha sempre um texto.

### Menu lateral

- Ocupa no máximo 84% da largura, limitado a 340 px.
- Perfil do aluno em amarelo, títulos de grupo em roxo e links em carvão.
- Deve fechar pelo botão, pelo backdrop e pela tecla `Escape`.
- Enquanto aberto, deve expor `aria-hidden="false"` e atualizar `aria-expanded` no gatilho.

### Navegação inferior

- Fundo carvão translúcido, quatro destinos no máximo e altura aproximada de 76 px.
- Ícone e rótulo sempre visíveis.
- Item atual em amarelo e marcado com `aria-current="page"`.
- O conteúdo precisa de padding inferior suficiente para não ficar coberto.

### Estado vazio

- Deve explicar que não houve resultado e sugerir uma ação corretiva.
- Use ícone amarelo, título claro e texto secundário cinza.
- Não remova silenciosamente toda a lista.

## 5. Estados

- **Hover:** clarear levemente a superfície ou a borda; nunca depender dele para revelar ações essenciais.
- **Focus:** outline amarelo de 3 px com offset de 3 px.
- **Active:** pequena redução de escala ou uso do roxo escuro.
- **Selecionado:** amarelo com texto escuro e atributo ARIA adequado.
- **Desabilitado:** opacidade reduzida, cursor padrão e ausência de sombra; mantenha o texto legível.
- **Vazio:** mensagem explícita e orientação para recuperação.

## 6. Responsividade

- A interface começa em 320 px e ocupa toda a viewport em celulares.
- A largura de referência é 375–430 px.
- Em telas a partir de 640 px, o aplicativo fica centralizado, limitado a 430 px e pode usar moldura arredondada.
- Cards devem evitar colunas rígidas para texto; áreas textuais usam `min-width: 0` e truncamento apenas em metadados.
- Não deve existir rolagem horizontal na página. Somente grupos de chips podem rolar horizontalmente.

## 7. Acessibilidade

- Manter contraste mínimo WCAG AA: 4.5:1 para texto comum e 3:1 para texto grande e elementos gráficos essenciais.
- Todo controle interativo deve funcionar por teclado e apresentar foco visível.
- Áreas de toque devem ter preferencialmente 44 × 44 px.
- Respeitar `prefers-reduced-motion`, reduzindo animações e rolagem suave.
- Usar HTML semântico, títulos em ordem, labels para campos e estados ARIA quando aplicável.
- Não usar cor, ícone ou posição como único meio de transmitir informação.

## 8. Aplicação em novas páginas

1. Reutilize os tokens de `:root`.
2. Mantenha cabeçalho, menu e navegação inferior consistentes.
3. Escolha um único objetivo primário por tela e associe-o ao amarelo.
4. Use roxo para agrupamento e identidade, não para competir com a ação principal.
5. Verifique 320, 375 e 430 px antes de considerar a página pronta.
6. Teste foco por teclado, contraste, redução de movimento, drawer e conteúdo coberto pela navegação.

## 9. Dashboard administrativo

O painel técnico adapta a identidade UTFPR para uma interface desktop de alta densidade. A estrutura pode ser mais clara e tabular que a experiência do aluno, mas deve preservar carvão nas superfícies principais, amarelo para seleção e ações primárias e roxo para apoio visual.

### Estrutura

- O cabeçalho ocupa toda a largura e reúne marca, busca global, notificações e perfil.
- A sidebar possui largura padrão entre 220 e 250 px e pode ser recolhida para aproximadamente 76 px.
- O conteúdo usa uma grade fluida, com largura mínima zero em todas as colunas para evitar estouro.
- Indicadores aparecem antes dos painéis operacionais e devem caber em uma única linha apenas quando houver espaço suficiente.
- Em telas largas, o conteúdo principal pode usar uma proporção aproximada de 60/40 entre operação prioritária e informações auxiliares.

### Superfícies administrativas

- Fundo da aplicação: carvão médio entre `#1B1B1B` e `#292929`.
- Painéis: carvão profundo, borda branca com 12% de opacidade e raio de 16 px.
- Cabeçalhos de painel devem ser compactos e separar título, contexto e ação secundária.
- Sombras devem ajudar na separação dos blocos sem criar aparência flutuante excessiva.
- Interfaces administrativas claras são permitidas em futuras variações, desde que mantenham contraste AA e reservem amarelo e roxo para identidade e hierarquia.

### Sidebar

- Item ativo usa amarelo com texto quase preto.
- Itens inativos usam texto secundário e recebem uma superfície clara translúcida no hover.
- Contadores devem ser curtos, arredondados e usar a cor semântica associada.
- No desktop, o controle de recolhimento permanece no rodapé da sidebar.
- Abaixo de 900 px, a sidebar vira drawer com backdrop, botão de fechamento e suporte à tecla `Escape`.

### Métricas

- Cada card contém ícone, rótulo, valor e tendência opcional.
- O valor deve ter maior peso visual; a cor semântica não pode substituir o texto.
- Cards de métricas mantêm altura e padding consistentes mesmo quando os rótulos variam.
- Use azul para informação, verde para sucesso, laranja ou vermelho para atenção, roxo para apoio e amarelo para manutenção ou identidade.

### Tabelas e seleção

- Cabeçalhos usam caixa alta ou peso elevado, tamanho reduzido e texto secundário.
- Linhas possuem altura confortável, bordas discretas e hover visível.
- A linha selecionada deve combinar fundo translúcido, marcador lateral e controle de seleção.
- Status devem aparecer em badges textuais, nunca apenas por cor.
- Tabelas podem rolar horizontalmente dentro do painel; a página inteira não deve gerar rolagem horizontal.
- Linhas selecionáveis precisam funcionar com clique, `Enter` e barra de espaço.

### Painel de detalhes e decisões

- A solicitação selecionada deve exibir aluno, histórico, item, disponibilidade, datas e justificativa.
- A ação principal usa amarelo; recusa e contato permanecem secundários.
- Recusas exigem motivo antes da atualização de estado.
- Após uma decisão, os controles associados ficam desabilitados e métricas, badges e atividades são atualizados visualmente.
- Mudanças locais devem ser anunciadas por uma região `aria-live` ou toast com `role="status"`.

## 10. Breakpoints administrativos

- **Até 430 px:** métricas em uma coluna, detalhes empilhados e busca compacta.
- **431–720 px:** métricas em duas colunas e painéis em uma coluna.
- **721–900 px:** sidebar em drawer e tabelas com rolagem interna.
- **901–1240 px:** sidebar fixa, conteúdo principal em uma coluna e painéis auxiliares em até duas colunas.
- **Acima de 1240 px:** dashboard completo em duas colunas e métricas em uma linha.

Em todas as larguras, validar foco visível, fechamento do drawer, legibilidade das tabelas, ausência de conteúdo coberto e suporte a `prefers-reduced-motion`.
