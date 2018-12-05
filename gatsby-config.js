module.exports = {
  siteMetadata: {
    title: `Almex Group`,
    description: `Conveyor Belt Vulcanizers | Vulcanizing Equipment | Almex`,
  },
  plugins: [
    {
      resolve: 'gatsby-source-graphcms',
      options: {
        endpoint: 'https://api-useast.graphcms.com/v1/cjp38sm4l76js01dg55spmgn6/master',
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoxLCJ0b2tlbklkIjoiYmQ4NWE4MjktNzk1YS00NzczLWFlMzUtZTg5ZWJmM2YxZGJmIn0.s-MUCKJyQbcmO7tdQjdYm8i7T3tIyJz8GNnz2qxgC_E',
        query: `{
          products {
            category
            id
            specifications
          }
        }`,
      },
    },
  ],
};
