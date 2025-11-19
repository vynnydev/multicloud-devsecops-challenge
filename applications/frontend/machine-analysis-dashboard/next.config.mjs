/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      // Alias para o mapbox-gl se necessário
    },
  },
  // Transpilar o mapbox-gl
  transpilePackages: ['mapbox-gl'],
}

export default nextConfig