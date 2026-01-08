// import { AuthResponseT, LoginRequestT, SignupRequestT, UserT } from 'src/types';
import baseApi from './baseApi';
import { TagName } from '../lib/tags';
import type {

} from '../../types';


export type DatasetT = {
  id: number,
  dataset: string,
  method: string,
  method_confidence_level: number | "nan" | "none",
  method_bias: number | "nan" | "none",
  method_recall_target: number | "nan" | "none",
  filename: string,
  row_count : number,
  rows?: RowT[]
}

export interface RowT {
  dataset: string;
  sim_rep: number;
  batch_i: number;
  n_total: number;
  n_seen: number;
  n_incl: number;
  n_incl_seen: number;
  method: string;
  safe_to_stop: boolean;
  method_score: number;
  method_confidence_level: number;
  method_bias: number;
  method_recall_target: number;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDatasetRegistry: build.query<DatasetT[], void>({
      query: () => ({
        url: '/csv/getRegistry',
        method: 'GET',
      }),
      providesTags: [{ type: TagName.Registry }],
    }),
    getDatasets: build.query<DatasetT[], number[]>({
      query: (body) => ({
        url: '/game/files',
        body: { ids: body },
        method: 'POST',
      }),
      providesTags: [{ type: TagName.Datasets }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetDatasetRegistryQuery,
  useGetDatasetsQuery
} = authApi;
