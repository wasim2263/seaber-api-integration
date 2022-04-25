import { HttpModuleOptions } from '@nestjs/axios';

export const httpOptionsConfig: HttpModuleOptions = {
  baseURL: `${process.env.API_BASE_URL}`,
  timeout: parseInt(process.env.API_HTTP_TIMEOUT),
  maxRedirects: 5,
};
