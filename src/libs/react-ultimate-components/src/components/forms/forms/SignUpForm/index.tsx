"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// SignUpForm.tsx
import {
    lowerCaseRegex,
    numbersRegex,
    specialCharacterRegex,
    upperCaseRegex,
} from "../../../../utils/regex";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import React, {
    forwardRef,
    useEffect,
    useId,
    useMemo,
    useState,
    type InputHTMLAttributes,
    type RefObject,
} from "react";
/* =========================================
   Root (form container)
   - Controlled by parent: values & onChange ficam fora
   - Dark mode tokens + responsivo
========================================= */

export interface SignUpFormRootProps {
    /** Envio do formulário (parent decide o que fazer) */
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    /** Classes extras para o <form> */
    className?: string;
    /** Conteúdo (subcomponentes) */
    children?: React.ReactNode;
}

function Root({
    onSubmit,
    className,
    children,
}: SignUpFormRootProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={clsx(
                "w-full max-w-lg",
                "bg-background text-foreground rounded-lg p-5 sm:p-6 shadow-sm",
                "border border-foreground/30",
                className
            )}
        >
            {children}
        </form>
    );
}


/* =========================================
   Title
========================================= */

export interface TitleProps {
    title: string;
    className?: string;
    subtitle?: string;
    subtitleClassName?: string;
}
function Title({
    title,
    className,
    subtitle,
    subtitleClassName,
}: TitleProps) { return (
    <div className="mb-4">
        <h2 className={clsx("text-lg sm:text-xl font-semibold", className)}>
            {title}
        </h2>
        {subtitle ? (
            <p
                className={clsx(
                    "text-foreground/70 text-xs sm:text-sm",
                    subtitleClassName
                )}
            >
                {subtitle}
            </p>
        ) : null}
    </div>
); }


/* =========================================
   TextInput (controlled)
========================================= */

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    helperText?: string;
    errorMessage?: string;
    containerClassName?: string;
}
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            id,
            label,
            helperText,
            errorMessage,
            className,
            containerClassName,
            disabled,
            ...rest
        },
        ref
    ) => {
        const inputId = id ?? `txt-${new Date().getTime().toString()}`;
        const helpId = `${inputId}-help`;
        const errId = `${inputId}-err`;

        return (
            <div className={clsx("w-full", containerClassName)}>
                <label
                    htmlFor={inputId}
                    className="block font-medium text-xs sm:text-sm text-foreground"
                >
                    {label}
                </label>

                <input
                    id={inputId}
                    ref={ref}
                    disabled={disabled}
                    aria-invalid={!!errorMessage || undefined}
                    aria-describedby={
                        errorMessage ? errId : helperText ? helpId : undefined
                    }
                    className={clsx(
                        "flex w-full h-10 rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base",
                        "border border-gray-300 dark:border-gray-600",
                        "outline-none ",
                        "focus:border-primary-600 focus:ring-2 focus:ring-primary-300/30",
                        "disabled:cursor-not-allowed disabled:opacity-70",
                        "px-2 py-1 my-1",
                        errorMessage &&
                        "border-red-400 focus:border-red-400 focus:ring-red-400/40",
                        className
                    )}
                    {...rest}
                />

                {errorMessage ? (
                    <p id={errId} className="text-red-400 text-xs sm:text-sm mt-1">
                        {errorMessage}
                    </p>
                ) : helperText && !disabled ? (
                    <p id={helpId} className="text-foreground/70 text-xs sm:text-sm mt-1">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);
TextInput.displayName = "SignUpTextInput";

/* =========================================
   PasswordInput (controlled)
========================================= */

export interface PasswordInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    helperText?: string;
    errorMessage?: string;
    containerClassName?: string;
    showPasswordVisibility?: boolean;
}
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            id,
            label,
            helperText,
            errorMessage,
            className,
            containerClassName,
            disabled,
            showPasswordVisibility = true,
            autoComplete = "new-password",
            ...rest
        },
        ref
    ) => {
        const reactId = useId();
        const inputId = id ?? `pwd-${reactId}`;
        const helpId = `${inputId}-help`;
        const errId = `${inputId}-err`;

        const [showPassword, setShowPassword] = useState(false);

        const wrapper =
            "flex w-full items-center rounded-md bg-background text-foreground placeholder:text-foreground/50 text-sm sm:text-base border ";
        const focusOk =
            "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-400/40";
        const baseBorder = "border-gray-300 dark:border-gray-600";
        const padding = "pl-2 py-1 pr-2 sm:pr-3 my-1 h-10";
        const errStyles =
            "border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/40";

        return (
            <div className={clsx("w-full", containerClassName)}>
                <label
                    htmlFor={inputId}
                    className="block font-medium text-xs sm:text-sm text-foreground"
                >
                    {label}
                </label>

                <div
                    className={clsx(
                        wrapper,
                        padding,
                        disabled && "opacity-70 cursor-not-allowed",
                        errorMessage ? errStyles : clsx(baseBorder, focusOk),
                        className
                    )}
                >
                    <input
                        id={inputId}
                        ref={ref}
                        type={showPassword ? "text" : "password"}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        aria-invalid={!!errorMessage || undefined}
                        aria-describedby={
                            errorMessage ? errId : helperText ? helpId : undefined
                        }
                        className="w-full bg-transparent outline-none"
                        {...rest}
                    />

                    {showPasswordVisibility && (
                        <button
                            type="button"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword((v) => !v)}
                            disabled={disabled}
                            className={clsx(
                                "ml-2 inline-flex items-center justify-center text-foreground/70 hover:text-foreground ",
                                disabled && "pointer-events-none"
                            )}
                        >
                            {showPassword ? (
                                <EyeClosedIcon size={20} weight="light" />
                            ) : (
                                <EyeIcon size={20} weight="light" />
                            )}
                        </button>
                    )}
                </div>

                {errorMessage ? (
                    <p id={errId} className="text-red-400 text-xs sm:text-sm mt-1">
                        {errorMessage}
                    </p>
                ) : helperText ? (
                    <p id={helpId} className="text-foreground/70 text-xs sm:text-sm mt-1">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);
PasswordInput.displayName = "SignUpPasswordInput";

/* =========================================
   Requirements (proxy para PasswordRequirements)
   - controlada pelo pai: recebe password e um ref booleano
========================================= */

export interface RequirementsProps {
    /** Requisitos de senha a serem validados. */
    requirements: Requirements;
    /** Senha atual (controlada pelo pai) */
    password: string;
    /** Ref booleana (pai fornece useRef<boolean>(false)) para saber se está válido */
    passwordValidatedRef: RefObject<boolean>;
    /** Tamanho mínimo (default: 8) */
    minLength?: number;
    /** Classes extras para o container */
    className?: string;
    /** Título opcional acima da lista */
    heading?: string;
}
function Requirements({
    password,
    passwordValidatedRef,
    requirements,
    className,
    heading = "Sua senha deve conter:",
}: RequirementsProps) {
    return (
        <div className={clsx("w-full", className)}>
            <span className="mb-2 block text-xs sm:text-xs md:text-sm text-foreground/80">
                {heading}
            </span>
            <PasswordRequirements
                requirements={requirements}
                password={password}
                passwordValidated={passwordValidatedRef}
                className="!mt-0"
            />
        </div>
    );
}


type Requirements = {
    hasLowerCase?: boolean;
    hasUpperCase?: boolean;
    hasNumber?: boolean;
    hasSpecial?: boolean;
    minLength?: number;
};

/* =========================================
   PasswordRequirements (internal)
   - controlada pelo pai: recebe password e um ref booleano
========================================= */

export interface PasswordRequirementsProps {
    /** Requisitos de senha a serem validados. */
    requirements: Requirements;
    /** Senha a ser validada. */
    password: string;
    /**
     * Ref booleana externa que recebe o estado final da validação.
     * Fica `true` quando TODOS os requisitos são atendidos.
     */
    passwordValidated: RefObject<boolean>;
    /** Classes adicionais para o contêiner externo. */
    className?: string;
}

export function PasswordRequirements({
    password = "",
    passwordValidated,
    requirements,
    className,
}: PasswordRequirementsProps) {
    // Computa todos os requisitos de forma síncrona (evita depender de setState assíncrono)

    const { hasLowerCase, hasUpperCase, hasNumber, hasSpecial, minLength } =
        requirements;

    const checks = useMemo(() => {
        const attendsHasLower = hasLowerCase ? lowerCaseRegex.test(password) : true;
        const attendsHasUpper = hasUpperCase ? upperCaseRegex.test(password) : true;
        const attendsHasNumber = hasNumber ? numbersRegex.test(password) : true;
        const attendsHasSpecial = hasSpecial
            ? specialCharacterRegex.test(password)
            : true;
        const attendsHasMin = minLength ? password.length >= minLength : true;

        return {
            hasLowerCase: attendsHasLower,
            hasUpperCase: attendsHasUpper,
            hasNumber: attendsHasNumber,
            hasSpecial: attendsHasSpecial,
            hasMin: attendsHasMin,
            allValid:
                attendsHasLower &&
                attendsHasUpper &&
                attendsHasNumber &&
                attendsHasSpecial &&
                attendsHasMin,
        };
    }, [hasLowerCase, hasNumber, hasSpecial, hasUpperCase, minLength, password]);

    // Atualiza o ref externo sempre que a senha mudar
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        (passwordValidated.current as boolean) = checks.allValid;
    }, [checks.allValid, passwordValidated]);

    const itemBase = "text-xs sm:text-xs md:text-sm leading-snug ";
    const ok = "text-green-700";
    const idle = "text-foreground/55";

    return (
        <div
            className={clsx(
                "w-full flex flex-col bg-background text-foreground",
                className
            )}
        >
            <ul
                role="list"
                className="w-full grid grid-cols-1 gap-y-1.5 list-disc pl-5"
            >
                {minLength && (
                    <li className={clsx(itemBase, checks.hasMin ? ok : idle)}>
                        Pelo menos {minLength} caracteres
                    </li>
                )}
                {hasUpperCase && (
                    <li className={clsx(itemBase, checks.hasUpperCase ? ok : idle)}>
                        Pelo menos 1 letra maiúscula
                    </li>
                )}
                {hasLowerCase && (
                    <li className={clsx(itemBase, checks.hasLowerCase ? ok : idle)}>
                        Pelo menos 1 letra minúscula
                    </li>
                )}
                {hasNumber && (
                    <li className={clsx(itemBase, checks.hasNumber ? ok : idle)}>
                        Pelo menos 1 número
                    </li>
                )}
                {hasSpecial && (
                    <li className={clsx(itemBase, checks.hasSpecial ? ok : idle)}>
                        Pelo menos 1 caractere especial
                    </li>
                )}
            </ul>
        </div>
    );
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**Label para o botão */
    label: string;
    /** Texto de ajuda (exibido antes do label). */
    helperText?: string;
    /** Elementos filhos opcionais para o botão. */
    children?: React.ReactNode;
    /** Classe opcional para o botão. */
    className?: string;
    /** Indica se o botão está em estado de carregamento. */
    isLoading?: boolean;
}

function SignUpButton({
    label,
    children,
    className,
    isLoading = false,
    ...rest
}: ButtonProps) {
    return (
        <button
            type="submit"
            className={clsx(
                "w-full flex items-center justify-center rounded-md text-white bg-primary-500  py-2 sm:px-4 sm:py-3 text-sm font-semibold cursor-pointer",
                className
            )}
            disabled={rest.disabled || isLoading}
            {...rest}
        >
            {label}
            {children && children}
        </button>
    );
}


/* =========================================
   Submit (usa seu <Button/>)
========================================= */

export interface SubmitProps {
    buttonLabel?: string;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
}
function Submit({
    buttonLabel,
    disabled,
    isLoading,
    className,
}: SubmitProps) { return (
    <div className={clsx("mt-4", className)}>
        <SignUpButton
            type="submit"
            label={buttonLabel ?? "Criar minha conta"}
            disabled={disabled}
            isLoading={isLoading}
            className="w-full"
        />
    </div>
); }


/* =========================================
   Namespace export (compound)
========================================= */

type SignUpFormExtras = {
    Root: typeof Root;
    Title: typeof Title;
    TextInput: typeof TextInput;
    PasswordInput: typeof PasswordInput;
    Requirements: typeof Requirements;
    Submit: typeof Submit;
};

function SignUpForm(props: SignUpFormRootProps) {
    return <Root {...props} />;
}

type SignUpFormComponent = typeof SignUpForm & SignUpFormExtras;

const SignUpFormComponent: SignUpFormComponent = Object.assign(SignUpForm, {
    Root,
    Title,
    TextInput,
    PasswordInput,
    Requirements,
    Submit,
});

export default SignUpFormComponent;
