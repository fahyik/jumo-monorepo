import React, { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface PixelBoxProps {
  width?: number;
  height?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  cornerSize?: number;
  children?: ReactNode;
}

export const PixelBox = ({
  width = 200,
  height = 100,
  borderWidth = 2,
  borderColor = "#000",
  backgroundColor = "#ffffff00",
  cornerSize = 12,
  children,
}: PixelBoxProps) => {
  const generateCornerPixels = () => {
    const pixels: { x: number; y: number }[] = [];
    const radius = cornerSize;

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

  const cornerPixels = generateCornerPixels();
  const borderFactor = 3;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} style={{ position: "absolute" }}>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={cornerSize + 2}
          ry={cornerSize + 2}
          fill={backgroundColor}
        />

        {/* Top and bottom borders */}
        <Rect
          x={cornerSize + borderFactor}
          y={0}
          width={width - (cornerSize + borderFactor) * 2}
          height={borderWidth}
          fill={borderColor}
        />
        <Rect
          x={cornerSize + borderFactor}
          y={height - borderWidth}
          width={width - (cornerSize + borderFactor) * 2}
          height={borderWidth}
          fill={borderColor}
        />

        {/* Left and right borders */}
        <Rect
          x={0}
          y={cornerSize + borderFactor}
          width={borderWidth}
          height={height - (cornerSize + borderFactor) * 2}
          fill={borderColor}
        />
        <Rect
          x={width - borderWidth}
          y={cornerSize + borderFactor}
          width={borderWidth}
          height={height - (cornerSize + borderFactor) * 2}
          fill={borderColor}
        />

        {/* Rounded corner pixels - dynamically generated circular arc */}
        {/* Top-left corner (swapped with bottom-right) */}
        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`tl-${i}`}
            x={cornerSize - pixel.x}
            y={cornerSize - pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}

        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`tr-${i}`}
            x={width - cornerSize - borderWidth + pixel.x}
            y={cornerSize - pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}

        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`bl-${i}`}
            x={cornerSize + borderWidth - pixel.x}
            y={height - cornerSize - borderFactor + pixel.y}
            width={borderWidth}
            height={borderWidth}
            fill={borderColor}
          />
        ))}

        {cornerPixels.map((pixel, i) => (
          <Rect
            key={`br-${i}`}
            x={width - cornerSize - borderFactor - borderWidth + pixel.x}
            y={pixel.y + height - cornerSize - borderWidth - borderFactor}
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
