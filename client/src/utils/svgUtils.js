export function createSvgUrl(svgContent, color) {
    return `data:image/svg+xml;base64,${btoa(svgContent.replace(/__FILL_COLOR__/g, color))}`;
}
  