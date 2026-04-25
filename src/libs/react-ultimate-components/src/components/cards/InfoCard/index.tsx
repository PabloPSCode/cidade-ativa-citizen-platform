"use client";

interface InfoCardProps {
  /** Título do card */
  title: string;
  /** Texto informativo do card */
  text: string;
  /** Ícone a ser exibido */
  icon: React.ReactNode;
  itemsPosition?: "left" | "right" | "center";
  /** Conteúdo adicional a ser exibido dentro do card */
  children?: React.ReactNode;
}

/**
 * Componente para exibir dados em forma de card.
 */
export default function InfoCard({
  title,
  text,
  icon,
  itemsPosition = "left",
  children,
}: InfoCardProps) {
  return (
    <div
      className={`flex flex-col  justify-center ${
        itemsPosition === "left"
          ? "items-start"
          : itemsPosition === "right"
          ? "items-end"
          : "items-center"
      } p-4 gap-2 bg-bg-card border-border-card border bg-card rounded-lg shadow`}
    >
      <div className="mb-4 text-2xl">{icon}</div>
      <div
        className={`flex flex-col ${
          itemsPosition === "left"
            ? "items-start"
            : itemsPosition === "right"
            ? "items-end"
            : "items-center"
        }`}
      >
        <h3 className="text-md sm:text-lg text-foreground  font-semibold">
          {title}
        </h3>
        <span className="text-xs sm:text-sm text-foreground/70 font-primary">
          {text}
        </span>
      </div>
      {children && children}
    </div>
  );
}

