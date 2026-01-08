// import { AuthResponseT, LoginRequestT, SignupRequestT, UserT } from 'src/types';
import baseApi from './baseApi';
import { TagName } from '../lib/tags';
import type {

} from '../../types';


export type resultT = {
  userId: number;
  datasetId: number;
  sessionId:number;
  stoppingStep: number;
  score: number;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitResult: build.mutation<void, resultT>({
      query: (body) => ({
        url: '/gameResults',
        method: 'POST',
        body: body,
        provideTags: [{ type: TagName.Result }],
      }),
    }),
    getAllResults: build.query<resultT[], void>({
      query: () => ({
        url: '/gameResults',
        method: 'GET',
      }),
      providesTags: [{ type: TagName.Result, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useSubmitResultMutation,
  useGetAllResultsQuery
} = authApi;
