"use client";

import TextAreaInput from "../../../inputs/TextAreaInput";
import TextInput from "../../../inputs/TextInput";
import clsx from "clsx";
import React, { useState } from "react";

export interface CommentaryFormProps {
  /** Rótulo acima da área de comentário (opcional). */
  label?: string;

  /** Classes extras do container externo. */
  containerClassName?: string;
  /** Classes extras do input (nome). */
  inputClassName?: string;
  /** Classes extras da área de texto (comentário). */
  textAreaClassName?: string;
  /** Classes extras do botão de envio. */
  buttonClassName?: string;
  /** Tamanho máximo do comentário (padrão: 500). */
  maxCommentLength?: number;

  /** Callback ao enviar. Recebe `{ name, comment }`. */
  onSubmit?: (data: { name: string; comment: string }) => void;
}

/**
 * CommentaryForm — formulário compacto para envio de comentários.
 * - **Responsivo**, com suporte a **dark mode** (tokens do DS).
 * - Segue os padrões anteriores (clsx, tokens `bg-bg-card`, `text-foreground`, etc.).
 */
export default function CommentaryForm({
  label = "Escreva seu comentário",
  containerClassName,
  inputClassName,
  textAreaClassName,
  buttonClassName,
  onSubmit,
  maxCommentLength = 500,
}: CommentaryFormProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit?.({ name: name.trim(), comment: comment.trim() });
  };

  return (
    <div className={clsx("w-full ", containerClassName)}>
      {label && (
        <label
          htmlFor="comment"
          className="text-foreground text-sm md:text-base"
        >
          {label}
        </label>
      )}
      <form
        onSubmit={handleSubmit}
        className={clsx(
          "w-full mt-2",
          "p-3 sm:p-4 md:p-6",
          "text-foreground rounded-md border border-foreground/10 bg-bg-card"
        )}
      >
        {/* Linha de inputs (stack no mobile) */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <TextInput
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className={clsx(
              "w-full rounded-full px-4 py-2 text-sm sm:text-base",
              "bg-background border border-border-card",
              "placeholder:text-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
              inputClassName
            )}
            aria-label="Seu nome"
            label="Seu nome"
          />
          {/* Caso precise de mais campos (ex.: email) você pode adicionar aqui */}
        </div>

        {/* Textarea + botão posicionado no canto inferior direito */}
        <div className="relative mt-3 sm:mt-4">
          <TextAreaInput
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={label}
            className={clsx(
              "w-full rounded-2xl px-4 py-3 pr-28 text-sm sm:text-base",
              "bg-background border border-border-card",
              "placeholder:text-foreground/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
              "min-h-[8rem]",
              textAreaClassName
            )}
            label="Comentário"
            maxTextLength={maxCommentLength}
            currentTextLength={comment.length}
          />

          <button
            type="submit"
            className={clsx(
              "w-full flex items-center justify-center rounded-md mt-4 px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold",
              "bg-primary-600 text-white hover:bg-primary-700 transition-colors",
              buttonClassName
            )}
            aria-label="Enviar comentário"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

