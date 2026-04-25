// index.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GLBViewer } from ".";

const meta: Meta<typeof GLBViewer> = {
  title: "Animations and Loading/GLBViewer",
  component: GLBViewer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "Viewer 3D para arquivos GLB usando React Three Fiber e Drei. " +
          "Suporta animacao por scroll (rotacao e escala), travamento no angulo frontal " +
          "e configuracoes do OrbitControls. " +
          "Use um arquivo .glb acessivel via URL ou caminho local.",
      },
    },
  },
  args: {
    // URL ou caminho local do arquivo .glb
    glbModelPath: "./models/street_fighter_arcade_cabinet.glb",
    // Altura do container (numero em px ou string CSS)
    height: "60vh",
    // Ativa animacao por scroll (rotacao e escala)
    animateOnScroll: true,
    // Se true, a rotacao para no angulo definido por frontRotationY
    stopAtFront: false,
    // Angulo frontal em radianos quando stopAtFront esta ativo
    frontRotationY: 0,
    // Fator de viewport para travar a rotacao (0.6 = 60% da altura da tela)
    lockAtScrollVH: 0.6,
    // Escala minima durante o scroll
    minScale: 0.8,
    // Escala maxima durante o scroll
    maxScale: 1.5,
    // Permite pan com mouse/touch no OrbitControls
    enablePan: true,
  },
  argTypes: {
    glbModelPath: {
      control: "text",
      description: "Caminho ou URL do arquivo .glb carregado no viewer.",
      table: { category: "Basico" },
    },
    height: {
      control: "text",
      description:
        "Altura do container. Aceita numero (px) ou string CSS (ex.: '60vh').",
      table: { category: "Basico" },
    },
    animateOnScroll: {
      control: "boolean",
      description:
        "Quando true, aplica rotacao e escala conforme o scroll da pagina.",
      table: { category: "Scroll" },
    },
    stopAtFront: {
      control: "boolean",
      description:
        "Se true, a rotacao para gradualmente no angulo frontal definido.",
      table: { category: "Scroll" },
    },
    frontRotationY: {
      control: { type: "number", step: 0.1 },
      description:
        "Rotacao alvo no eixo Y (radianos) quando stopAtFront esta ativo.",
      table: { category: "Scroll" },
    },
    lockAtScrollVH: {
      control: { type: "number", min: 0, max: 2, step: 0.05 },
      description:
        "Fator de altura da viewport usado para calcular o ponto de travamento.",
      table: { category: "Scroll" },
    },
    minScale: {
      control: { type: "number", min: 0.1, max: 3, step: 0.05 },
      description: "Escala minima do modelo durante a animacao de scroll.",
      table: { category: "Scroll" },
    },
    maxScale: {
      control: { type: "number", min: 0.1, max: 5, step: 0.05 },
      description: "Escala maxima do modelo durante a animacao de scroll.",
      table: { category: "Scroll" },
    },
    enablePan: {
      control: "boolean",
      description: "Permite mover (pan) a camera com o mouse/touch.",
      table: { category: "OrbitControls" },
    },
    enableRotate: {
      control: "boolean",
      description: "Permite rotacao manual com mouse/touch.",
      table: { category: "OrbitControls" },
    },
    rotateSpeed: {
      control: { type: "number", step: 0.1 },
      description: "Velocidade da rotacao manual.",
      table: { category: "OrbitControls" },
    },
    autoRotate: {
      control: "boolean",
      description: "Ativa rotacao automatica do modelo.",
      table: { category: "OrbitControls" },
    },
    autoRotateSpeed: {
      control: { type: "number", step: 0.1 },
      description: "Velocidade da rotacao automatica.",
      table: { category: "OrbitControls" },
    },
    enableZoom: {
      control: "boolean",
      description: "Permite zoom via wheel ou pinch.",
      table: { category: "OrbitControls" },
    },
    minPolarAngle: {
      control: { type: "number", min: 0, max: 3.14, step: 0.05 },
      description: "Limite minimo do angulo polar.",
      table: { category: "OrbitControls" },
    },
    maxPolarAngle: {
      control: { type: "number", min: 0, max: 3.14, step: 0.05 },
      description: "Limite maximo do angulo polar.",
      table: { category: "OrbitControls" },
    },
    minAzimuthAngle: {
      control: { type: "number", min: -6.28, max: 6.28, step: 0.05 },
      description: "Limite minimo do angulo azimutal.",
      table: { category: "OrbitControls" },
    },
    maxAzimuthAngle: {
      control: { type: "number", min: -6.28, max: 6.28, step: 0.05 },
      description: "Limite maximo do angulo azimutal.",
      table: { category: "OrbitControls" },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GLBViewer>;

/* ===================== Stories ===================== */

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Exemplo padrao com animacao por scroll e pan habilitado no OrbitControls.",
      },
    },
  },
};

export const StopAtFront: Story = {
  name: "Travar no frontal",
  args: {
    stopAtFront: true,
    frontRotationY: 0,
    lockAtScrollVH: 0.8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A rotacao para gradualmente quando o scroll atinge o ponto definido por lockAtScrollVH.",
      },
    },
  },
};

export const NoScrollAutoRotate: Story = {
  name: "Sem scroll + auto rotate",
  args: {
    animateOnScroll: false,
    autoRotate: true,
    autoRotateSpeed: 1,
    enablePan: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Desativa a animacao por scroll e usa o auto rotate do OrbitControls.",
      },
    },
  },
};

export const RestrictedOrbit: Story = {
  name: "Orbit restrito",
  args: {
    animateOnScroll: false,
    enablePan: false,
    minPolarAngle: 0.6,
    maxPolarAngle: 1.6,
    minAzimuthAngle: -0.6,
    maxAzimuthAngle: 0.6,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Exemplo com limites de rotacao para manter a camera em um arco menor.",
      },
    },
  },
};
