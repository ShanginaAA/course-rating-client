import type { FC, SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CreateIconConfig = {
  /** Один path (атрибут d). */
  path?: string;
  /** Несколько path — для иконок из нескольких контуров. */
  paths?: string[];
  /** viewBox по умолчанию. */
  viewBox?: string;
};

const defaultSvgProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
};

type IconSkeletonProps = IconProps & {
  pathList: string[];
  defaultViewBox: string;
};

const IconSkeleton: FC<IconSkeletonProps> = ({
  pathList,
  defaultViewBox,
  size = 24,
  width,
  height,
  fill = defaultSvgProps.fill,
  stroke = defaultSvgProps.stroke,
  strokeWidth = defaultSvgProps.strokeWidth,
  strokeLinecap = defaultSvgProps.strokeLinecap,
  strokeLinejoin = defaultSvgProps.strokeLinejoin,
  viewBox = defaultViewBox,
  ...rest
}) => {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      {...rest}
    >
      {pathList.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
};

/**
 * Создаёт компонент иконки с заданным path/paths (скелет для иконки).
 * Коллекция иконок расширяется за счёт вызовов createIcon с разными path.
 */
export const createIcon = (config: CreateIconConfig): FC<IconProps> => {
  const pathList = config.path ? [config.path] : config.paths ?? [];
  const viewBox = config.viewBox ?? defaultSvgProps.viewBox;

  const IconComponent: FC<IconProps> = (props) => (
    <IconSkeleton pathList={pathList} defaultViewBox={viewBox} {...props} />
  );

  return IconComponent;
};
