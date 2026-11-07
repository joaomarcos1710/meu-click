# MeuClick - Plataforma de Galeria de Eventos com Reconhecimento Facial

O **MeuClick** resolve a dispersão de fotos em eventos sociais e corporativos (casamentos, formaturas, aniversários, conferências), permitindo que convidados e fotógrafos enviem mídias para um repositório centralizado, e que qualquer participante encontre instantaneamente suas próprias fotos tirando uma selfie com reconhecimento facial alimentado por IA, além de navegação tradicional por pastas.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões principais do produto foram confirmadas a partir das suas respostas:
> 
> - **Reconhecimento Facial com IA Real**: Utilizaremos a API multimodal do **Gemini 3.8 Flash Vision** (`@google/genai`) rodando no backend/proxy server. O participante tira uma selfie com a câmera do celular e a IA compara traços fisionômicos com as fotos do evento, retornando os matches com grau de confiança e destaque.
> - **Fluxo de Monetização & Download**: Visualização fluida com marca d'água dinâmica do evento; download com marca d'água gratuito para redes sociais; checkout simulado / PIX para desbloqueio da versão original em alta resolução (sem marca) e botão de envio direto com mensagem formatada para o WhatsApp.
> - **Acesso e Multi-Upload Aberto**: O link ou QR Code do evento concede acesso imediato para visualização e envio de fotos por convidados e fotógrafos, sem obrigar download de aplicativo nativo na App Store/Play Store.

---

### 1. Overview & Core Concept

- **O que faz**:
  1. **Criador/Organizador**: Cria o evento (nome, data, local, capa, marca d'água personalizada e preço por foto opcional), gerando link e QR Code imprimível/compartilhável.
  2. **Multi-Upload Colaborativo**: Fotógrafos profissionais, equipe de assessoria e convidados enviam fotos em lote (drag-and-drop ou seleção no celular), com visualização do progresso.
  3. **Organização Dupla**:
     - *Modo Pastas*: Álbuns temáticos manuais (ex.: "Cerimônia", "Pista de Dança", "Mesa de Doces", "Turma de Engenharia").
     - *Modo Selfie IA*: O participante abre a câmera frontal, envia uma selfie e o sistema filtra apenas as fotos em que ele aparece.
  4. **Entrega & WhatsApp**: O participante seleciona suas fotos favoritas e pode compartilhá-las ou recebê-las diretamente no WhatsApp ou baixá-las.
- **Público-Alvo**:
  - Fotógrafos de eventos e organizadores que querem monetizar ou entregar fotos com agilidade.
  - Noivos, formandos e anfitriões de festas.
  - Convidados do evento que querem suas fotos sem precisar garimpar milhares de cliques.

---

### 2. User Experience & Visual Design

Conforme as diretrizes de design mobile-first e fotografia editorial:
- **Aesthetic Direction**: Visual editorial de galeria moderna, minimalista e limpo. Foco total nas imagens com tipografia geométrica expressiva (`Plus Jakarta Sans` para títulos e `DM Sans` para leitura), contraste equilibrado e ausência de elementos visuais poluídos (zero-pill metadata, linhas finas de divisão e transições suaves).
- **Paleta de Cores (Regra 60-30-10)**:
  - *60% Neutro*: Telas em branco puro / dark slate suave (`#0B0F17` no tema escuro e `#F8FAFC` no claro).
  - *30% Superfície Estrutural*: Cartões de fotos, modais e planilhas inferiores com bordas finas (`border-slate-200 dark:border-slate-800`).
  - *10% Destaque Focado*: Azul índigo / cobalto vibrante (`#2563EB`) para o botão principal de selfie, upload e checkout.
- **Ergonomia Mobile**:
  - Touch targets de no mínimo 44x44px.
  - Botão de ação rápida flutuante no polegar (Selfie Scanner e Upload).
  - Lightbox imersivo com pinch-to-zoom, swipe entre fotos e atalho de WhatsApp.
  - QR Code em modal de alta fidelidade pronto para ser projetado em telão ou impresso em mesas.

---

### 3. Key Product Decisions & Trade-Offs

- **IA Facial no MVP (Gemini 3.8 Flash Vision)**:
  - *Abordagem*: O backend Express processa a selfie do usuário e as fotos do evento enviando-as em lote otimizado para o Gemini 3.8 Flash com prompt estruturado de correspondência facial (identificação biométrica comparativa e contagem de faces correspondentes).
  - *Vantagem*: Sem custo de infraestrutura complexa externa como AWS Rekognition no primeiro momento; funciona nativamente com a chave de API já conectada ao AI Studio; migração futura trivial para Rekognition ou Face-API se desejado.
- **Marca d'Água Dinâmica em Canvas**:
  - A marca d'água ("MeuClick • [Nome do Evento]") é renderizada dinamicamente sobre a foto para visualização rápida no navegador, protegendo o arquivo original de alta definição que fica salvo no servidor até a confirmação de compra ou download autorizado.
- **Persistência de Dados**:
  - Armazenamento em memória persistida no backend / local state no client com eventos de demonstração ricos já pré-carregados (casamento e formatura) para teste imediato de upload, selfie e WhatsApp.

---

### 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                       MeuClick Client (Vite + React)                  │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation (Brand Wordmark, Modo Organizador/Convidado, Tema)    │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │   Organizer Studio    │  │        Guest Portal (Mobile)         │  │
│  │ - Event Manager       │  │ - Hero do Evento & Capa              │  │
│  │ - Multi-Upload Batch  │  │ - Modo de Busca (Selfie IA vs Pastas)│  │
│  │ - Folder / Album Org  │  │ - Selfie Cam Modal & Matching Engine │  │
│  │ - QR Code Modal & Print│ │ - Grid de Fotos com Marca d'Água     │  │
│  │ - Painel de Vendas    │  │ - Lightbox com WhatsApp & Checkout   │  │
│  └───────────────────────┘  └──────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Express Backend Server (server.ts)                  │
├────────────────────────────────────────────────────────────────────────┤
│  - /api/events               (CRUD de eventos, metadados e capas)      │
│  - /api/events/:id/photos    (Upload de fotos em lote)                 │
│  - /api/events/:id/match-face (Gemini 3.8 Flash Vision Face Matcher)   │
│  - /api/events/:id/watermark (Geração de fotos com marca d'água)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ @google/genai SDK
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Google Gemini 3.8 Flash Vision Model                  │
│       Análise comparativa de feições faciais (Selfie vs Fotos)         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. User Stories Prioritárias do MVP

1. **US1 - Criação e Compartilhamento de Evento**:
   - *Como* anfitrião ou fotógrafo, *quero* criar um evento em menos de 1 minuto informando nome, data e capa, *para* gerar um link e QR Code para meus convidados.
2. **US2 - Multi-Upload Eficiente**:
   - *Como* fotógrafo ou convidado, *quero* selecionar dezenas de fotos do meu celular ou computador de uma só vez, *para* alimentar o álbum compartilhado sem fricção.
3. **US3 - Encontrar Fotos por Selfie (IA)**:
   - *Como* convidado da festa, *quero* abrir a câmera do celular, tirar uma selfie e ver instantaneamente todas as fotos em que apareço, *para* não perder tempo procurando entre centenas de imagens.
4. **US4 - Organização Manual por Pastas**:
   - *Como* fotógrafo, *quero* criar álbuns/pastas (ex: "Entrada dos Noivos", "Formatura Individual"), *para* que quem preferir possa navegar tradicionalmente.
5. **US5 - Visualização com Marca d'Água & Download / Compra**:
   - *Como* participante, *quero* visualizar as fotos em alta qualidade com marca d'água sutil e escolher entre download livre com marca ou desbloqueio sem marca.
6. **US6 - Entrega e Compartilhamento via WhatsApp**:
   - *Como* participante, *quero* enviar com 1 clique a seleção de fotos com link direto para o meu WhatsApp ou de amigos.

---

### 6. Ordem de Desenvolvimento Recomendada

1. **Fundação e Backend Proxy**: Configurar `server.ts` com endpoints de eventos, uploads e rota `/api/match-face` integrando o `@google/genai` com `gemini-3.8-flash`.
2. **Design System & Shell**: Configurar fontes (`Plus Jakarta Sans`), Tailwind dark/light mode e cabeçalho limpo com alternância de visão (Organizador vs Convidado).
3. **Gerenciador de Eventos & QR Code**: Criação de eventos com gerador dinâmico de QR Code pronto para impressão/exibição.
4. **Área de Multi-Upload e Pastas**: Componente de arrastar/soltar com visualização de miniaturas e atribuição a pastas.
5. **Câmera de Selfie & Engine de Reconhecimento Facial com Gemini**: Modal com acesso à câmera do smartphone / upload de selfie, enviando para a API e exibindo os matches com porcentagem de confiança.
6. **Galeria Responsiva, Lightbox & Integração WhatsApp**: Grid fluido estilo galeria fotográfica, marca d'água em canvas, modal de checkout simplificado e botão de compartilhamento no WhatsApp.
