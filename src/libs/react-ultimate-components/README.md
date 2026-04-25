# 📦 React Ultimate Components - Biblioteca de Componentes React

Bem-vindo(a)!\
Este projeto contém uma coleção completa de componentes React
reutilizáveis, responsivos e totalmente customizáveis, prontos para uso
em projetos modernos desenvolvidos com React, Vite ou qualquer
ambiente compatível.

Você recebeu esta biblioteca em formato ZIP para instalar localmente no
seu projeto e utilizá-la como um pacote npm privado.

------------------------------------------------------------------------

# 🚀 Requisitos

Antes de começar, certifique-se de ter instalado:

-   **Node.js 20+**
-   **npm**, **pnpm** ou **yarn**
-   **React 18+ ou 19+**
-   **TailwindCSS 3+ ou 4+**
-   **Next.js 13+**

------------------------------------------------------------------------

# 📥 Instalação e uso dos componentes (usando o ZIP fornecido)

1. Na raíz do seu projeto, crie uma pasta chamada "libs".
2. Extraia o ZIP e copie a pasta react-ultimate-components contendo todos os arquivos para dentro da pasta libs criada no passo 1.

```{=html}

    meu-projeto/
     ├─ src/
     ├─ package.json
     └─ libs/
         └─ react-ultimate-components/
             ├─ src/
             ├─ package.json
             ├─ README.md
             └─ LICENSE
```

3.  Instale o pacote:

``` bash
npm install ./libs/react-ultimate-components
```

4. Caso seu projeto ainda não tenha o TailwindCSS instalado e configurado, instale e configure o TailwindCSS no seu projeto seguindo a [documentação do Tailwind em projetos Next](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

5. Cole o conteúdo do arquivo index.css que está dentro da pasta styles para dentro do seu arquivo principal do CSS. Se o seu projeto já tiver uma configuração de Tailwind, mescle o conteúdo com cuidado para não remover o que você já usa.
   
6. Os componentes estão prontos para uso. Importe os componentes conforme necessário:

``` tsx
import { Button, CartCard, MaskedTextInput } from "react-ultimate-components";
```

------------------------------------------------------------------------

# 🎨 Estilos, tokens e customização

Para alterar os temas e estilos dos componentes basta alterar os valores dos tokens das cores e/ou os estilos css ambos dentro do arquivo index.css.

------------------------------------------------------------------------

# ❓ Suporte

Consulte a [documentação no Storybook](https://docs.reactultimate.pablosilvadev.com.br/) ou envie um email para pablojmde@gmail.com.
