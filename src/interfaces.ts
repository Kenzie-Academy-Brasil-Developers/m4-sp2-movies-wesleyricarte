import { QueryResult } from "pg";

export interface iMovieRequest {
	name: string;
	description?: string | null;
	duration: number;
	price: number;
}

export interface iMovie extends iMovieRequest {
	id: number;
}

export type tMovieResponse = QueryResult<iMovie>
