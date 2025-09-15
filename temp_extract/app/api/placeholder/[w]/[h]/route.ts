export async function GET(
  _req: Request,
  ctx: { params: Promise<{ w: string; h: string }> }
) {
  const params = await ctx.params
  const width = parseInt(params.w, 10) || 400
  const height = parseInt(params.h, 10) || 300

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#001B55" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#FF9C04" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#ccc" stroke-width="2" stroke-dasharray="8 6"/>
  <g fill="#666" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="14" text-anchor="middle">
    <text x="${width / 2}" y="${height / 2}">${width} × ${height}</text>
  </g>
  <circle cx="${width * 0.2}" cy="${height * 0.3}" r="${Math.min(width, height) * 0.05}" fill="#001B55" fill-opacity="0.3"/>
  <circle cx="${width * 0.8}" cy="${height * 0.7}" r="${Math.min(width, height) * 0.06}" fill="#FF9C04" fill-opacity="0.3"/>
  <circle cx="${width * 0.7}" cy="${height * 0.25}" r="${Math.min(width, height) * 0.04}" fill="#001B55" fill-opacity="0.25"/>
  <circle cx="${width * 0.3}" cy="${height * 0.75}" r="${Math.min(width, height) * 0.045}" fill="#FF9C04" fill-opacity="0.25"/>
  Sorry, your browser does not support inline SVG.
</svg>`

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  })
}
