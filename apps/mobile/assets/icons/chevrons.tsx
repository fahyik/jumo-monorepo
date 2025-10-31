import Svg, { Path, SvgProps } from "react-native-svg";

const ChevronLeft = ({ width = 24, height = 24, ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="1 0 24 24" {...props}>
    <Path d="M11 13H12V14H13V15H14V16H15V17H16V18H17V19H16V20H15V19H14V18H13V17H12V16H11V15H10V14H9V13H8V11H9V10H10V9H11V8H12V7H13V6H14V5H15V4H16V5H17V6H16V7H15V8H14V9H13V10H12V11H11V13Z" />
  </Svg>
);

export { ChevronLeft };
