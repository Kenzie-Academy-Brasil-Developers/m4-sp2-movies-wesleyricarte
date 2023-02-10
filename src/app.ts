import express, { Application } from 'express';
import { startDatabase } from './database';
import {
	createMovie,
	deleteMovie,
	listAllMovies,
	updateMovie,
} from './functions';
import { ensureMovieExists, preventDuplicateName } from './middlewares';

const app: Application = express();
app.use(express.json());

// ROUTES:

app.post('/movies', preventDuplicateName, createMovie);

app.get('/movies', listAllMovies);

app.patch('/movies/:id', preventDuplicateName, ensureMovieExists, updateMovie);

app.delete('/movies/:id', ensureMovieExists, deleteMovie);

// APP LISTEN:

app.listen(3000, async () => {
	await startDatabase();
	console.log('Server is running!');
});
