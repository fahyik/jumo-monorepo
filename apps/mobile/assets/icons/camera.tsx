import Svg, { Path, SvgProps } from "react-native-svg";

const Camera = ({ width = 24, height = 24, ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" {...props}>
    <Path d="M22 3V2H2v1H1v18h1v1h20v-1h1V3zM3 4h6v1H3zm14 13h-1v2h-2v1h-4v-1H8v-2H7v-4h1v-2h2v-1h4v1h2v2h1zm4-9H3V7h6V6h1V5h1V4h10z" />
    <Path d="M15 13v4h-1v1h-4v-1H9v-4h1v3h1v-2h2v-1h-3v-1h4v1z" />
  </Svg>
);

export { Camera };
