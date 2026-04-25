import type { Meta, StoryObj } from "@storybook/react-vite";
import WavesSeparator from ".";

const meta = {
  title: "Miscellaneous/WavesSeparator",
  component: WavesSeparator,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Separador de seções baseado em SVG com variações de onda e cores configuráveis via props.",
      },
    },
  },
  args: {
    primaryColor: "var(--color-primary-500)",
    backgroundColor: "var(--color-background)",
    variant: "curved",
    height: 80,
  },
  argTypes: {
    primaryColor: {
      control: "text",
      description: "Cor do bloco superior (aceita hex, rgb, hsl, var(--token)).",
    },
    backgroundColor: {
      control: "text",
      description: "Cor da área inferior/recorte da onda.",
    },
    variant: {
      control: "select",
      options: [
        "curved",
        "sharped",
        "squared",
        "soft",
        "tilted-left",
        "tilted-right",
      ],
      description: "Tipo de onda do separador.",
    },
    height: {
      control: { type: "range", min: 24, max: 180, step: 2 },
      description: "Altura da onda em px.",
    },
    className: { control: false },
    svgClassName: { control: false },
  },
} satisfies Meta<typeof WavesSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-full">
      <div
        className="h-20 w-full"
        style={{ backgroundColor: args.primaryColor }}
      />
      <WavesSeparator {...args} />
      <div
        className="h-20 w-full"
        style={{ backgroundColor: args.backgroundColor }}
      />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const variants = [
      "curved",
      "sharped",
      "squared",
      "soft",
      "tilted-left",
      "tilted-right",
    ] as const;

    return (
      <div className="w-full bg-background py-6">
        {variants.map((variant) => (
          <div key={variant} className="mb-8">
            <p className="px-4 pb-2 text-sm font-medium text-foreground/80">
              {variant}
            </p>
            <div className="h-16 w-full bg-primary-500" />
            <WavesSeparator
              primaryColor="var(--color-primary-500)"
              backgroundColor="var(--color-background)"
              variant={variant}
              height={72}
            />
            <div className="h-16 w-full bg-background" />
          </div>
        ))}
      </div>
    );
  },
};

