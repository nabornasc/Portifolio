# Portfólio Dev — Nabor N Silva

> Um portfólio em construção, feito para transformar aprendizado em projetos
> reais — com código, criatividade e um toque de neon. ✨

Este repositório reúne a evolução do meu portfólio pessoal e o primeiro projeto
interativo apresentado nele: a **Minha Calculadora**, atualmente na versão
**0.1**.

O objetivo é construir uma experiência simples, visual e funcional para
apresentar meus estudos em desenvolvimento web, registrando não apenas o
resultado final, mas também o processo por trás de cada etapa.

## Visão geral

O projeto possui duas experiências principais:

1. **Página inicial do portfólio** — uma apresentação pessoal com slideshow,
   alternância entre tema claro e escuro e uma área de projeto em destaque.
2. **Minha Calculadora** — uma calculadora web com operações básicas, funções
   extras e interface neumórfica responsiva.

Na página inicial, o botão **Minha Calculadora** funciona como uma vitrine
interativa: ele usa a imagem do próprio projeto como fundo, apresenta uma
composição futurista com efeito de vidro e neon e leva diretamente para a
calculadora.

## Resultado atual

### Página inicial

- Identidade visual simples e centralizada;
- apresentação com nome e descrição do portfólio;
- slideshow automático com intervalo de três segundos;
- botão de tema claro/escuro;
- preferência de tema salva no `localStorage`;
- destaque visual para o projeto da calculadora;
- botão responsivo com:
  - imagem de fundo da calculadora;
  - efeito cristalizado;
  - iluminação neon;
  - animação ao passar o mouse;
  - estado de foco para navegação por teclado;
  - suporte a `prefers-reduced-motion`.

### Calculadora — versão 0.1

- soma, subtração, multiplicação e divisão;
- números decimais;
- porcentagem;
- troca de sinal positivo/negativo;
- apagar o último dígito;
- limpar a operação atual;
- limite de 12 dígitos na entrada;
- bloqueio de pontos decimais repetidos;
- tratamento de divisão por zero;
- exibição da expressão e do resultado;
- layout responsivo para telas menores;
- efeitos de profundidade e interação nos botões.

## O processo de criação

### 1. Construção da base

O projeto começou com uma estrutura enxuta em HTML, CSS e JavaScript. A
prioridade inicial foi separar a interface da lógica e manter os arquivos
organizados por responsabilidade:

- HTML para a estrutura;
- CSS para a identidade visual e responsividade;
- JavaScript para interações e comportamento.

### 2. Desenvolvimento da calculadora

A calculadora foi montada com um display para expressão e resultado, além de um
teclado organizado em uma grade de quatro colunas. Cada botão possui atributos
`data-*`, permitindo que o JavaScript identifique números, operadores e ações
sem depender do texto visual do botão.

O estado da calculadora controla a entrada atual, o primeiro número, o operador
selecionado e o status do cálculo. Essa organização permite que recursos como
porcentagem, apagar, limpar e troca de sinal funcionem de forma integrada.

### 3. Refinamento visual

Depois da funcionalidade básica, a interface recebeu uma camada visual
neumórfica:

- sombras externas para criar profundidade;
- sombras internas no display;
- botões com estados de `hover` e `active`;
- cores diferentes para ações, operadores e resultado;
- adaptação para dispositivos móveis.

### 4. Evolução do portfólio

Com a calculadora pronta, o próximo passo foi transformar o projeto em uma
experiência apresentável. A página inicial ganhou:

- slideshow de imagens;
- alternância persistente de tema;
- seção de projeto em destaque;
- navegação direta para `projetos/calculadora.html`.

### 5. Criação do botão de destaque

O botão **Minha Calculadora** foi pensado como uma pequena “porta de entrada”
para o projeto. Em vez de ser apenas um link, ele combina:

- uma prévia visual da calculadora;
- camada escura para melhorar a leitura;
- reflexo diagonal animado;
- brilho ciano;
- movimento sutil no hover;
- foco visível para acessibilidade.

O resultado é um componente que comunica a proposta do projeto antes mesmo de o
visitante abrir a calculadora.

## Tecnologias utilizadas

| Tecnologia | Uso |
| --- | --- |
| HTML5 | Estrutura das páginas e dos componentes |
| CSS3 | Layout, responsividade, temas, sombras e animações |
| JavaScript | Operações, interações, slideshow e persistência do tema |
| `localStorage` | Salvamento da preferência de tema |
| Git | Controle da evolução do projeto |

## Organização do projeto

```text
Portifolio/
├── index.html                         # Página inicial do portfólio
├── css/
│   └── style.css                      # Estilos do portfólio
├── js/
│   └── main.js                        # Slideshow e alternância de tema
├── img/                               # Imagens, ícones e recursos visuais
├── projetos/
│   └── calculadora.html               # Página da calculadora
├── projetos/calculadora/
│   ├── css/style.css                  # Estilos da calculadora
│   ├── js/operacoes.js                # Operações matemáticas
│   ├── js/script.js                   # Estado e eventos da interface
│   └── teste-calculadora.js           # Testes do projeto
└── README.md                          # Documentação
```

## Como executar

Como o projeto utiliza arquivos estáticos, não é necessário instalar
dependências para visualizar a aplicação.

### Opção 1 — abrir diretamente

Abra o arquivo `index.html` no navegador.

### Opção 2 — usar o Live Server

No VS Code:

1. instale a extensão **Live Server**;
2. abra o arquivo `index.html`;
3. clique com o botão direito no arquivo;
4. selecione **Open with Live Server**.

O Live Server é recomendado durante o desenvolvimento porque atualiza a página
automaticamente após as alterações.

## Próximos passos

A versão 0.1 estabelece a base visual e funcional. As próximas evoluções podem
incluir:

- suporte ao teclado físico;
- histórico de operações;
- expressões com múltiplos operadores e precedência matemática;
- testes automatizados mais amplos;
- melhorias de acessibilidade nos controles;
- novos projetos exibidos na página inicial;
- publicação do portfólio em uma hospedagem web.

## Aprendizados

Este projeto foi construído passo a passo para praticar conceitos fundamentais
do desenvolvimento front-end:

- estrutura semântica em HTML;
- organização de estilos em CSS;
- manipulação do DOM;
- eventos de clique;
- gerenciamento de estado;
- persistência com `localStorage`;
- responsividade;
- acessibilidade;
- documentação técnica.

Mais do que uma calculadora, este projeto representa o início de uma coleção de
experimentos e aprendizados. A ideia é continuar evoluindo, testar novas
soluções e transformar cada funcionalidade em uma oportunidade de aprender algo
novo. 🚀

## Autor

**Nabor N Silva**

Desenvolvedor em formação, construindo projetos com curiosidade, prática e
vontade de transformar ideias em experiências digitais.
