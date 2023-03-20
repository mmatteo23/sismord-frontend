type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function ZKMailingLogo({ className, style }: Props): JSX.Element {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M9.77242 27.7492V29.2588L3.4918 37.9249H10.0259V39.884H0.702969V38.3052L6.9375 29.7083H1.03717V27.7492H9.77242ZM12.6534 22.0678H14.8661V39.884H12.6534V22.0678ZM23.1288 39.884H20.4207L15.1772 33.0157L19.6601 27.7492H22.2876L17.8738 32.9004L23.1288 39.884Z"
        fill="white"
      />
      <path
        d="M26.7987 28.4058H35.3625V40H26.7987L22.7407 34.2029L26.7987 28.4058Z"
        fill="white"
      />
      <path
        d="M3.76904 23.7681V9.27538C3.76904 6.07373 6.3645 3.47827 9.56615 3.47827H30.4357C33.6374 3.47827 36.2328 6.07373 36.2328 9.27538V23.7681H19.71"
        stroke="white"
        strokeWidth="1.73913"
        strokeLinecap="round"
      />
    </svg>
  );
}
