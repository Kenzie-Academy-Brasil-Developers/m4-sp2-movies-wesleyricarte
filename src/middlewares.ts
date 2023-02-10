import { Request, Response, NextFunction } from 'express';
import { QueryConfig } from 'pg';
import { client } from './database';

export const ensureMovieExists = async (
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | void> => {
	const id: number = parseInt(request.params.id);

	const queryString: string = `
        SELECT
            *
        FROM 
            movies
        WHERE
            id = $1
    `;

	const queryConfig: QueryConfig = {
		text: queryString,
		values: [id],
	};

	const queryResult = await client.query(queryConfig);

	if (!queryResult.rowCount) {
		return response.status(404).json({
			message: 'Movie not found!',
		});
	}

	return next();
};

export const preventDuplicateName = async (
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | void> => {
	const name: string = request.body.name;

	const queryString: string = `
        SELECT * 
        FROM movies 
        WHERE name = '${name}';
    `;

	const queryResult = await client.query(queryString);

	if (queryResult.rowCount) {
		return response.status(409).json({
			message: 'Movie name already exists!',
		});
	}

	return next();
};
