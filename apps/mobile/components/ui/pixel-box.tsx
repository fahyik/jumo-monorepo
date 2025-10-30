import React, { ReactNode, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
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
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const flatStyle = StyleSheet.flatten(style);

  const borderWidth =
    typeof flatStyle?.borderWidth === "number" ? flatStyle.borderWidth : 2;
  const borderColor =
    typeof flatStyle?.borderColor === "string" ? flatStyle.borderColor : "#000";
  const backgroundColor =
    typeof flatStyle?.backgroundColor === "string"
      ? flatStyle.backgroundColor
      : "#ffffff00";
  const padding =
    typeof flatStyle?.padding === "number" ? flatStyle.padding : 4;

  const cornerRadius = cornerSize === "md" ? 8 : 12;
  const cornerGap = cornerRadius / 4;
  const cornerPixels = generateCornerPixels(borderWidth, cornerRadius);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const {
    borderWidth: _,
    borderColor: __,
    backgroundColor: ___,
    padding: ____,
    ...contentStyle
  } = flatStyle || {};

  return (
    <View
      style={[{ padding, overflow: "visible" }, contentStyle]}
      onLayout={handleLayout}
    >
      {dimensions && (
        <Svg
          width={dimensions.width + 1}
          height={dimensions.height + 1}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            rx={cornerRadius + 2}
            ry={cornerRadius + 2}
            fill={backgroundColor}
          />

          {/* Top and bottom borders */}
          <Rect
            x={cornerRadius + cornerGap}
            y={0}
            width={dimensions.width - (cornerRadius + cornerGap) * 2}
            height={borderWidth}
            fill={borderColor}
          />
          <Rect
            x={cornerRadius + cornerGap}
            y={dimensions.height - borderWidth}
            width={dimensions.width - (cornerRadius + cornerGap) * 2}
            height={borderWidth}
            fill={borderColor}
          />

          {/* Left and right borders */}
          <Rect
            x={0}
            y={cornerRadius + cornerGap}
            width={borderWidth}
            height={dimensions.height - (cornerRadius + cornerGap) * 2}
            fill={borderColor}
          />
          <Rect
            x={dimensions.width - borderWidth}
            y={cornerRadius + cornerGap}
            width={borderWidth}
            height={dimensions.height - (cornerRadius + cornerGap) * 2}
            fill={borderColor}
          />

          {/* Rounded corner pixels - dynamically generated circular arc */}
          {/* Top-left corner */}
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

          {/* Top-right corner */}
          {cornerPixels.map((pixel, i) => (
            <Rect
              key={`tr-${i}`}
              x={dimensions.width - cornerRadius - borderWidth + pixel.x}
              y={cornerRadius - pixel.y}
              width={borderWidth}
              height={borderWidth}
              fill={borderColor}
            />
          ))}

          {/* Bottom-left corner */}
          {cornerPixels.map((pixel, i) => (
            <Rect
              key={`bl-${i}`}
              x={cornerRadius - pixel.x}
              y={dimensions.height - cornerRadius - borderWidth + pixel.y}
              width={borderWidth}
              height={borderWidth}
              fill={borderColor}
            />
          ))}

          {/* Bottom-right corner */}
          {cornerPixels.map((pixel, i) => (
            <Rect
              key={`br-${i}`}
              x={dimensions.width - cornerRadius - borderWidth + pixel.x}
              y={dimensions.height - cornerRadius - borderWidth + pixel.y}
              width={borderWidth}
              height={borderWidth}
              fill={borderColor}
            />
          ))}
        </Svg>
      )}

      {children}
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
