import { Request, Response } from 'express';
import { QueryConfig } from 'pg';
import format from 'pg-format';
import { client } from './database';
import { iMovie, iMovieRequest, tMovieResponse } from './interfaces';

export const createMovie = async (
	request: Request,
	response: Response
): Promise<Response> => {
	const movieDataRequest: iMovieRequest = request.body;

	let movieData = {};

	if (!movieDataRequest.description) {
		movieData = {
			...movieDataRequest,
			description: null,
		};
	} else {
		movieData = {
			...movieDataRequest,
		};
	}

	const queryString: string = format(
		`INSERT INTO
            movies(%I)
        VALUES
            (%L)
        RETURNING *;`,
		Object.keys(movieData),
		Object.values(movieData)
	);

	const queryResult: tMovieResponse = await client.query(queryString);

	const newMovie: iMovie = queryResult.rows[0];

	return response.status(201).json(newMovie);
};

export const listAllMovies = async (
	request: Request,
	response: Response
): Promise<Response> => {
	let previousPage: any = 0;
	let nextPage: any = 0;

	let perPage: any =
		request.query.perPage === undefined ? 5 : request.query.perPage;
	let page: any = request.query.page === undefined ? 0 : request.query.page;

	perPage = parseInt(perPage);
	page = parseInt(page);

	console.log(page, perPage);

	if (typeof perPage !== 'number') {
		perPage = 5;
	} else if (perPage <= 0) {
		perPage = 5;
	} else if (perPage > 5) {
		perPage = 5;
	}

	if (typeof page !== 'number') {
		page = 0;
		previousPage = null;
	} else if (page <= 1) {
		nextPage = `http://localhost:3000/movies?page=${
			page + 1
		}&perPage${perPage}`;

		page = 0;

		previousPage = null;
	} else {
		previousPage = `http://localhost:3000/movies?page=${
			page - 1
		}&perPage${perPage}`;

		nextPage = `http://localhost:3000/movies?page=${
			page + 1
		}&perPage${perPage}`;

		page = (page - 1) * perPage;
	}

	console.log(page, perPage);

	const queryString: string = `
        SELECT
            *
        FROM
            movies
        LIMIT $1 OFFSET $2;
    `;

	const queryConfig: QueryConfig = {
		text: queryString,
		values: [perPage, page],
	};

	const queryResult: tMovieResponse = await client.query(queryConfig);

	if (queryResult.rowCount < perPage) {
		nextPage = null;
	}

	return response.status(200).json({
		previousPage: previousPage,
		nextPage: nextPage,
		count: queryResult.rowCount,
		data: queryResult.rows,
	});
};

export const updateMovie = async (
	request: Request,
	response: Response
): Promise<Response> => {
	const id: number = parseInt(request.params.id);

	const movieData = Object.values(request.body);
	const movieKeys = Object.keys(request.body);

	const formatString: string = format(
		`
        UPDATE
            movies
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `,
		movieKeys,
		movieData
	);

	const queryConfig: QueryConfig = {
		text: formatString,
		values: [id],
	};

	const queryResult = await client.query(queryConfig);

	return response.status(200).json(queryResult.rows[0]);
};

export const deleteMovie = async (
	request: Request,
	response: Response
): Promise<Response> => {
	const id: number = parseInt(request.params.id);

	const queryString: string = `
        DELETE FROM
            movies
        WHERE 
            id = $1;
    `;

	const queryConfig: QueryConfig = {
		text: queryString,
		values: [id],
	};

	await client.query(queryConfig);

	return response.status(204).send();
};
