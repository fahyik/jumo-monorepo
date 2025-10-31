import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from "react-native-svg";

const Landscape = ({ width = 32, height = 32, ...props }: SvgProps) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...props}>
    <G clipPath="url(#clip0_1135_2895)">
      <Path d="M31.24 3.81H29.72V29.72H31.24V3.81Z" />
      <Path d="M29.72 29.72H3.81V31.24H29.72V29.72Z" />
      <Path d="M28.19 2.29004H26.67V26.67H28.19V2.29004Z" />
      <Path d="M23.62 14.48H20.57V16H23.62V20.57H25.15V5.34003H23.62V14.48Z" />
      <Path d="M20.57 19.05H19.05V20.57H5.34003V22.1H23.62V20.57H20.57V19.05Z" />
      <Path d="M20.57 16H19.05V17.53H20.57V16Z" />
      <Path d="M19.05 17.53H17.53V19.05H19.05V17.53Z" />
      <Path d="M17.53 12.95H20.57V11.43H22.1V8.37999H20.57V6.85999H17.53V8.37999H16V11.43H17.53V12.95Z" />
      <Path d="M17.53 16H16V17.53H17.53V16Z" />
      <Path d="M16 14.48H14.48V16H16V14.48Z" />
      <Path d="M14.48 12.95H12.96V14.48H14.48V12.95Z" />
      <Path d="M12.96 11.43H9.91003V12.95H12.96V11.43Z" />
      <Path d="M9.91 12.95H8.38V14.48H9.91V12.95Z" />
      <Path d="M8.37999 14.48H6.85999V16H8.37999V14.48Z" />
      <Path d="M23.62 3.81H5.34003V5.34H23.62V3.81Z" />
      <Path d="M5.34 17.53H6.86V16H5.34V5.34003H3.81V20.57H5.34V17.53Z" />
      <Path d="M26.67 0.76001H2.29004V2.29001H26.67V0.76001Z" />
      <Path d="M26.67 26.67H2.29004V28.19H26.67V26.67Z" />
      <Path d="M2.29001 2.29004H0.76001V26.67H2.29001V2.29004Z" />
    </G>
    <Defs>
      <ClipPath id="clip0_1135_2895">
        <Rect width={width} height={height} />
      </ClipPath>
    </Defs>
  </Svg>
);

export { Landscape };
