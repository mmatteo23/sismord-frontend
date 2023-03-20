type Props = {
  size: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
};

export function Shard({
  size,
  color,
  className,
  style,
  strokeWidth,
}: Props): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M5.00053 0.810636L9.16713 4.06368L5.00053 9.14777L0.83341 4.06368L5.00053 0.810636Z"
        fill={color}
        stroke={color}
        strokeWidth={0.293004}
      />
    </svg>
  );
}
