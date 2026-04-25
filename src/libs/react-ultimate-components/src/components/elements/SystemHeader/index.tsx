"use client";

import useTheme from "../../../hooks/useTheme";
import {
    BellIcon,
    HeadphonesIcon,
    MoonIcon,
    SignOutIcon,
    SunIcon,
    UserIcon
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import SearchInput, { type SearchInputProps } from "./components/SearchInput";

type Size = "sm" | "md" | "lg";

export interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
    size?: Size;
    bordered?: boolean;
    sticky?: boolean;
}
function Root({
    size = "md",
    bordered = true,
    sticky = true,
    className,
    children,
    ...rest
}: HeaderRootProps) {

    return (
        <header
            {...rest}
            className={clsx(
                "w-full bg-background text-card-foreground",
                bordered && "border-b border-foreground/20",
                sticky && "sticky top-0 z-40",
                className
            )}
        >
            <div
                className={clsx(
                    "mx-auto flex w-full items-center justify-between gap-4 px-3",
                    size === "sm" && "h-16",
                    size === "md" && "h-18",
                    size === "lg" && "h-20"
                )}
            >
                {children}
            </div>
        </header>
    );
}


/** Left/Center/Right layout rails keep composition flexible */
export interface LeftContainerProps {
    className?: string;
    children?: React.ReactNode;
}

function LeftContainer({
    className,
    children,
    ...rest
}: LeftContainerProps) { return (
    <div
        {...rest}
        className={clsx("flex w-[45vw] sm:w-1/3 max-w-lg items-center gap-3", className)}
    >
        {children}
    </div>
); }


export interface CenterContainerProps {
    className?: string;
    children?: React.ReactNode;
}

export interface RightContainerProps {
    className?: string;
    children?: React.ReactNode;
}

function RightContainer({
    className,
    children,
    ...rest
}: RightContainerProps) { return (
    <div
        {...rest}
        className={clsx(
            "flex w-fit justify-end items-center gap-1",
            className
        )}
    >
        {children}
    </div>
); }


export interface LogoProps {
    src: string;
    alt: string;
    className?: string;
}

function Logo({ src, alt, className }: LogoProps) {
    return (
        <Image
            src={src}
            alt={alt}
            className={clsx("block", "h-9 w-auto", className)}
            width={160}
            height={48}
        />
    );
}


export interface SearchProps extends SearchInputProps {
    className?: string;
}

function Search({ className, ...rest }: SearchProps) {
    return <SearchInput className={className} {...rest} />;
}


/** Generic icon button used by action items */
function IconButton({ badge, className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        badge?: number;
        "aria-label": string;
    }) {
    return (
        <button
            {...rest}
            className={clsx(
                "relative inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent",
                "hover:text-foreground/50 text-foreground/80 ",
                "h-9 w-9",
                className
            )}
        >
            {children}
            {typeof badge === "number" && badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-info-500 px-1.5 text-[10px] font-semibold text-white">
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </button>
    );
}



export interface NotificationsProps {
    count?: number;
    onSeeNotifications?: () => void;
}

function Notifications({
    count = 0,
    onSeeNotifications,
}: NotificationsProps) {
    return (
        <IconButton
            aria-label="Notificações"
            badge={count}
            onClick={onSeeNotifications}
        >
            <BellIcon className="h-5 w-5" />
        </IconButton>
    );
}


/** Help / Support */

export interface HelpButtonProps {
    onHelp?: () => void;
}

function Help({ onHelp }: HelpButtonProps) { return (
    <IconButton aria-label="Ajuda e suporte" onClick={onHelp}>
        <HeadphonesIcon className="h-5 w-5" />
    </IconButton>
); }


/** Theme Switcher*/

export interface ThemeSwitcherProps {
    onToggleTheme?: () => void;
}

function ThemeSwitcher({ onToggleTheme }: ThemeSwitcherProps) {
    const { theme, setTheme } = useTheme();
    return (
        <IconButton
            aria-label="Alterar tema"
            onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
                onToggleTheme?.();
            }}
        >
            {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
            ) : (
                <SunIcon className="h-5 w-5" />
            )}
        </IconButton>
    );
}


/** UserIcon menu (compound) */
function UserMenu({ name, email, avatarUrl, onSignOut }: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    onSignOut?: () => void;
}) {

    return (
        <div
            aria-label="Menu do usuário"
            className="w-fit flex items-center gap-2 rounded-full bg-foreground/5 px-2.5 py-1.5 focus:outline-none ml-2 border border-foreground/10"
        >
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="avatar"
                    className="h-7 w-7 rounded-full"
                    width={28}
                    height={28}
                    sizes="28px"
                />
            ) : (
                <UserIcon className="h-7 w-7 text-muted-foreground" />
            )}
            <span className="w-full hidden sm:flex flex-col leading-tight text-left ">
                <b className="text-xs">{name}</b>
                {email && (
                    <span className="text-[11px] text-muted-foreground text-foreground/70">
                        {email}
                    </span>
                )}
            </span>
            <button
                className="flex items-center justify-end gap-1 text-xs text-foreground/80 ml-1"
                onClick={onSignOut}
            >
                <SignOutIcon className="h-4 w-4" /> Sair
            </button>
        </div>
    );
}


type SystemHeaderExtras = {
    Root: typeof Root;
    LeftContainer: typeof LeftContainer;
    RightContainer: typeof RightContainer;
    Logo: typeof Logo;
    Search: typeof Search;
    Notifications: typeof Notifications;
    Help: typeof Help;
    UserMenu: typeof UserMenu;
    ThemeSwitcher: typeof ThemeSwitcher;
};

function SystemHeader(props: HeaderRootProps) {
    return <Root {...props} />;
}

type SystemHeaderComponent = typeof SystemHeader & SystemHeaderExtras;

const SystemHeaderComponent: SystemHeaderComponent = Object.assign(SystemHeader, {
    Root,
    LeftContainer,
    RightContainer,
    Logo,
    Search,
    Notifications,
    Help,
    UserMenu,
    ThemeSwitcher,
});

export default SystemHeaderComponent;
