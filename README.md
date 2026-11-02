# TemAí?

Despensa, o que está em uso e a lista de compras da casa, iguais em todos os celulares.

App web instalável (PWA), publicado pelo GitHub Pages. Os dados ficam no Firebase
(Firestore), com login do Google; só as contas da casa têm acesso, pelas regras de
segurança configuradas no console do Firebase.

- `index.html`: o app inteiro (telas, regras e acesso aos dados)
- `firebase.js`: Firebase JS SDK 12.19.0 (Apache-2.0), empacotado num arquivo só
- `config.js`: dados públicos do projeto Firebase
- `sw.js` e `manifest.webmanifest`: instalação e uso sem internet
