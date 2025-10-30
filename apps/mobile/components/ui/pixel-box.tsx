import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface PixelBoxProps {
  style?: ViewStyle;
  cornerSize?: "md" | "lg";
  children?: ReactNode;
}

export const PixelBox = ({
  style,
  cornerSize = "md",
  children,
}: PixelBoxProps) => {
  const flatStyle = StyleSheet.flatten(style);

  const width = typeof flatStyle?.width === "number" ? flatStyle.width : 200;
  const height = typeof flatStyle?.height === "number" ? flatStyle.height : 100;

  const borderWidth =
    typeof flatStyle?.borderWidth === "number" ? flatStyle.borderWidth : 2;
  const borderColor =
    typeof flatStyle?.borderColor === "string" ? flatStyle.borderColor : "#000";
  const backgroundColor =
    typeof flatStyle?.backgroundColor === "string"
      ? flatStyle.backgroundColor
      : "#ffffff00";

  const cornerRadius = cornerSize === "md" ? 8 : 12;
  const cornerGap = cornerRadius / 4;
  const cornerPixels = generateCornerPixels(borderWidth, cornerRadius);

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} style={{ position: "absolute" }}>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={cornerRadius + 2}
          ry={cornerRadius + 2}
          fill={backgroundColor}
        />

        {/* Top and bottom borders */}
        <Rect
          x={cornerRadius + cornerGap}
          y={0}
          width={width - (cornerRadius + cornerGap) * 2}
          height={borderWidth}
          fill={borderColor}
        />
        <Rect
          x={cornerRadius + cornerGap}
          y={height - borderWidth}
          width={width - (cornerRadius + cornerGap) * 2}
          height={borderWidth}
          fill={borderColor}
        />

        {/* Left and right borders */}
        <Rect
          x={0}
          y={cornerRadius + cornerGap}
          width={borderWidth}
          height={height - (cornerRadius + cornerGap) * 2}
          fill={borderColor}
        />
        <Rect
          x={width - borderWidth}
          y={cornerRadius + cornerGap}
          width={borderWidth}
          height={height - (cornerRadius + cornerGap) * 2}
          fill={borderColor}
        />

        {/* Rounded corner pixels - dynamically generated circular arc */}
        {/* Top-left corner (swapped with bottom-right) */}
        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`tl-${i}`}
            x={cornerRadius - pixel.x}
            y={cornerRadius - pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}

        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`tr-${i}`}
            x={width - cornerRadius - borderWidth + pixel.x}
            y={cornerRadius - pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}

        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`bl-${i}`}
            x={cornerRadius - pixel.x}
            y={height - cornerRadius - borderWidth + pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}

        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`br-${i}`}
            x={width - cornerRadius - borderWidth + pixel.x}
            y={height - cornerRadius - borderWidth + pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}
      </Svg>

      <View style={{ padding: borderWidth + 4, flex: 1 }}>{children}</View>
    </View>
  );
};

const generateCornerPixels = (borderWidth: number, cornerRadius: number) => {
  const pixels: { x: number; y: number }[] = [];
  const radius = cornerRadius;

  const roundingFactor = 0.8;

  for (let y = borderWidth; y < radius; y += borderWidth) {
    const x = Math.sqrt(radius * radius - y * y);
    if (x >= borderWidth && x < radius) {
      pixels.push({
        x:
          (Math.round((x / borderWidth) * roundingFactor) / roundingFactor) *
          borderWidth,
        y,
      });
    }
  }

  for (let x = borderWidth; x < radius; x += borderWidth) {
    const y = Math.sqrt(radius * radius - x * x);
    if (y >= borderWidth && y < radius) {
      const roundedX = x;
      const roundedY =
        (Math.round((y / borderWidth) * roundingFactor) / roundingFactor) *
        borderWidth;
      if (!pixels.some((p) => p.x === roundedX && p.y === roundedY)) {
        pixels.push({ x: roundedX, y: roundedY });
      }
    }
  }

  return pixels;
};
