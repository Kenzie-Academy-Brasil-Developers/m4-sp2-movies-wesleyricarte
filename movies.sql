CREATE DATABASE sprint2;

CREATE TABLE movies(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	description VARCHAR(255),
	duration INTEGER NOT NULL,
	price DECIMAL(10,2) NOT NULL
);

INSERT INTO
	movies(name, description, duration, price)
VALUES
	('Lagoa Azul', 'Filme da lagoa azul, extremamente assistido no Jornal da tarde', 98, 15.00);

SELECT  
	*
FROM
	movies;

INSERT INTO
	movies(name, description, duration, price)
VALUES
	('Duro de Matar', 'Tiro pra todo lado, sangue e explosões.', 123, 19.00),
	('Velozes e Furiosos 5', 'Aquele filme que piora a imagem que já era ruim do Brasil', 131, 25.00),
	('Querido John', 'Um clássico pra assistir e terminar em sexo', 116, 20.00),
	('It', 'Assita esse clássico para soltar sua franga!', 84, 11.90);
	