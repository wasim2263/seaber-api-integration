import {HttpService} from '@nestjs/axios';
import {HttpException, Injectable} from '@nestjs/common';
import {AxiosResponse} from 'axios';
import {catchError, map, of, throwError} from 'rxjs';

@Injectable()
export class ApiRequestService {
    constructor(private readonly httpService: HttpService) {
        // console.log(httpService);
    }
    //curl http://localhost:8080 -X POST   -H "Content-type: application/json"   -d '{ }'
    async postRequest(
        apiUrl: string,
        payload: Record<any, any>,
    ):Promise<any> {
        console.log(apiUrl, payload);
        return this.httpService.post(apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
        }).pipe(
            map((response) => {
                // console.log('response ----', response)
                return {
                    data: {
                        response: response.data,
                    },
                    status: response.status,
                    statusText: 'success',
                };
            }),
            catchError((e)=>{
                // console.log(e.response.data, e.response.status);
                return of({
                    data: {
                        response: e.response.data,
                    },
                    status: e.response.status,
                    statusText: 'failed',
                });
            }),
        );
    }
}
