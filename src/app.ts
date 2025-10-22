import express from 'express';
import cors from 'cors';
import { API } from './utils/contants';
import { Versions } from './utils/common.type';
import { authRouter } from './modules/auth/auth-route';
import { responseFormatterMiddleware } from './middleware/api-response.middleware';
// import { UserRoutes } from "./modules/user/user.routes";

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(responseFormatterMiddleware);
// Mount user routes
// const userRoutes = new UserRoutes();
// app.use("/api/users", userRoutes.router);
app.get('/api/test', (_req, res) => {
  console.log('Test successfull');
  return res.json('Test completed');
});
app.use(`/${API}/${Versions.V1}/auth`, authRouter);
export default app;
