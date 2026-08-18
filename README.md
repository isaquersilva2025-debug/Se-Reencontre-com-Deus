# Se Reencontre com Deus — Landing Page Premium

Página de vendas do produto digital **“Se Reencontre com Deus”** — 21 Dias para
Voltar, Reencontrar e Permanecer.

Tecnologias: **HTML5 + CSS3 + JavaScript vanilla** (sem frameworks). Google Fonts
(Playfair Display + Inter).

## Estrutura

```
se-reencontre-com-deus/
├── index.html          → página completa (todas as seções)
├── css/
│   └── style.css       → design system, animações e responsividade
├── js/
│   └── script.js       → intro, cronômetro, reveal, carousel, FAQ, CTAs
└── img/
    ├── capa-principal.svg     → capa do ebook (mockup)
    ├── diario-oracao.svg      → bônus: Diário de Oração
    ├── plano-leitura.svg      → bônus: Plano de Leitura Bíblica — 30 Dias
    ├── guia-oracao.svg        → bônus: Guia de Oração
    └── checklist.svg          → bônus: Checklist dos 21 Dias
```

## Antes de publicar — substitua os placeholders

### 1. Links de checkout (obrigatório)
Abra `js/script.js` e substitua as duas constantes no topo:

```js
const ESSENCIAL_CHECKOUT_URL = '#'; // ← link real do plano ESSENCIAL
const COMPLETO_CHECKOUT_URL = '#';  // ← link real da EXPERIÊNCIA COMPLETA
```

Todos os botões de compra da página usam essas constantes automaticamente
(botões do hero, dos planos e do CTA final).

### 2. Imagens reais (opcional)
As capas atuais são mockups em SVG (gerados para o protótipo). Para usar
imagens reais, substitua os arquivos em `img/` mantendo os mesmos nomes —
ou troque os caminhos no `index.html`.

### 3. Depoimentos reais
A seção de depoimentos contém **3 cards marcados como “DEPOIMENTO DE EXEMPLO”**.
Substitua o texto e o autor por depoimentos reais (com permissão dos autores).

### 4. Links do rodapé
Termos de Uso, Política de Privacidade e Contato estão como `#` — atualize em
`js/script.js` (função `initFooterLinks`).

### 5. Garantia
O texto de garantia é provisório e neutro. Ajuste-o conforme as condições
reais configuradas no seu checkout.

## Como funciona o cronômetro

- Contagem regressiva de **30:00** em **dois lugares**: barra fixa no topo
  (sempre visível, em tom de urgência) e na seção de planos.
- O número da barra do topo tem um **pulso sutil a cada segundo** e um indicador
  vermelho “ao vivo” pulsando ao lado do texto. Os números das seções têm um
  **fade/flip rápido** a cada segundo.
- Cor de urgência: **vermelho neon #FF1744** com glow, usado apenas em
  cronômetros, selos de desconto e badge “live” — o restante da página permanece
  na paleta (creme, verde profundo, dourado).
- O início da sessão fica salvo em `localStorage` (chave `offerSessionStart`),
  então **continua correto mesmo após atualizar a página**.
- Ao chegar a 00:00 a página mostra “✨ Nova sessão promocional iniciada”, anima os
  contadores e **reinicia em 30:00** — sem afirmar que a oferta acabou para sempre.
- Os preços são apresentados como **condição promocional da sessão atual**, com
  selos de desconto `-72% OFF` (Essencial) e `-70% OFF` (Experiência Completa).

## Ordem das seções (página enxuta, focada em conversão)

1. Barra de urgência fixa no topo (tom de alerta)
2. Hero (com link “Ver planos e valores”)
3. Planos — oferta principal (com cronômetro + selos de desconto + detalhes completos)
4. Avaliações (depoimentos reais, em breve)
5. Dúvidas (FAQ)
6. CTA final → Footer

**Todos os botões de venda pulsam** para chamar o clique: a Experiência Completa
tem pulso de escala + glow dourado + brilho passando (shine sweep) com fundo em
gradiente dourado (#D9B876 → #C6A15B); os botões Essenciais pulsam em verde
profundo. Sobre o botão da Experiência Completa há a chamada animada
“👇 Clique aqui e comece hoje” com seta quicando. O selo “MAIS ESCOLHIDO” é uma
etiqueta de canto com sombra, no card destacado.

## Como testar

Abra o `index.html` diretamente no navegador ou sirva a pasta com um servidor
local, por exemplo:

```bash
cd se-reencontre-com-deus
python -m http.server 8000
# ou
npx serve .
```
