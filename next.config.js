/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'prisma']
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('@prisma/client')
        }
        return config
    },
    // Deshabilitar la recolección de datos de página para rutas API durante el build
    generateBuildId: async () => {
        return 'build-' + Date.now()
    },
    // Configuración específica para Vercel
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    }
}

module.exports = nextConfig 