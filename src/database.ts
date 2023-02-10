import { Client } from 'pg';

export const client: Client = new Client({
	user: 'Wesley',
	password: 'Post656887',
	host: 'localhost',
	database: 'sprint2',
	port: 5432,
});

export const startDatabase = async(): Promise<void> => {
    await client.connect()
    console.log('Database connected!')
}
