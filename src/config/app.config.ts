/* /src/config/app.config.ts File */
export default () => ({
  environment: process.env.NODE_ENV || 'development',
  urlMongo: process.env.URL_MONGO,
});

export const databaseurl = () => process.env.URL_MONGO;
