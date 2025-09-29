import {ReactNode} from "react";
import {Link} from "react-router-dom";
import {cn} from "@/lib/utils";

type LinkTarget = "_blank" | "_self";

interface TypographyProps {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: LinkTarget;
  onClick?: () => void;
}

// Util: chọn thẻ Link nội bộ hay <a> bên ngoài
const LinkWrapper = ({
  href,
  target,
  children,
}: {
  href: string;
  target?: LinkTarget;
  children: ReactNode;
}) => {
  const isExternal = /^https?:\/\//.test(href) || target === "_blank";
  if (isExternal) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return <Link to={href}>{children}</Link>;
};

// Headings
export const HeadingHero = ({children, className, href}: TypographyProps) => {
  const content = (
    <h1
      className={cn(
        "font-inter text-[48px] font-semibold leading-[72px] tracking-tight",
        className,
      )}
    >
      {children}
    </h1>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const Heading1 = ({children, className, href}: TypographyProps) => {
  const content = (
    <h1
      className={cn(
        "font-inter text-[40px] font-semibold leading-[60px] tracking-tight",
        className,
      )}
    >
      {children}
    </h1>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const Heading2 = ({children, className, href}: TypographyProps) => {
  const content = (
    <h2
      className={cn(
        "font-inter text-[32px] font-semibold leading-[48px] tracking-tight",
        className,
      )}
    >
      {children}
    </h2>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const Heading3 = ({children, className, href}: TypographyProps) => {
  const content = (
    <h3
      className={cn(
        "font-inter text-[24px] font-semibold leading-[36px] tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const Heading4 = ({children, className, href}: TypographyProps) => {
  const content = (
    <h4
      className={cn(
        "font-inter text-[20px] font-semibold leading-[30px] tracking-normal",
        className,
      )}
    >
      {children}
    </h4>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const Heading5 = ({
  children,
  className,
  href,
  target,
}: TypographyProps) => {
  const content = (
    <h5
      className={cn(
        "font-inter text-[16px] font-semibold leading-[24px] tracking-normal",
        className,
      )}
    >
      {children}
    </h5>
  );
  return href ? (
    <LinkWrapper href={href} target={target}>
      {content}
    </LinkWrapper>
  ) : (
    content
  );
};

// Body
export const BodyBold = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[16px] font-bold leading-[24px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const BodyMedium = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[16px] font-medium leading-[24px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const BodyRegular = ({
  children,
  className,
  href,
  target,
}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[16px] font-normal leading-[24px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? (
    <LinkWrapper href={href} target={target}>
      {content}
    </LinkWrapper>
  ) : (
    content
  );
};

// Caption
export const CaptionBold = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[14px] font-bold leading-[20px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const CaptionMedium = ({
  children,
  className,
  href,
  target,
  onClick,
}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[14px] font-medium leading-[20px] tracking-normal",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </p>
  );
  return href ? (
    <LinkWrapper href={href} target={target}>
      {content}
    </LinkWrapper>
  ) : (
    content
  );
};

export const CaptionRegular = ({
  children,
  className,
  href,
}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[14px] font-normal leading-[20px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

// Small
export const SmallMedium = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[12px] font-medium leading-[18px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const SmallRegular = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[12px] font-normal leading-[18px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

// Tiny
export const TinyMedium = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[10px] font-medium leading-[14px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};

export const TinyRegular = ({children, className, href}: TypographyProps) => {
  const content = (
    <p
      className={cn(
        "font-inter text-[10px] font-normal leading-[14px] tracking-normal",
        className,
      )}
    >
      {children}
    </p>
  );
  return href ? <LinkWrapper href={href}>{content}</LinkWrapper> : content;
};
