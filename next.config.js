module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/flowbuilder',
          permanent: true,
        },
      ]
    },
}