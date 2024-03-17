const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')
const { validateMovie, partialValidateMovie } = require('./schemas/movies')

const app = express()

app.disable('x-power-by')
app.use(express.json())
app.use(
	cors({
		origin: (origin, callback) => {}
	})
)

app.get('/', (req, res) => {
	res.json({ message: 'Hola Mundo!' })
})

app.get('/movies', (req, res) => {
	// res.header('Access-Control-Allow-Origin', '*')
	const { genre } = req.query
	if (genre) {
		const filteredMovies = movies.filter((movie) =>
			movie.genre.some((m) => m.toLowerCase() === genre.toLowerCase())
		)

		return res.json(filteredMovies)
	}
	res.json(movies)
})

app.get('/movies/:id', (req, res) => {
	const { id } = req.params

	const movie = movies.find((movie) => movie.id === id)
	if (movie) return res.json(movie)

	res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
	const result = validateMovie(req.body)

	if (result.error) {
		return res.status(400).json({ error: JSON.parse(result.error.message) })
	}

	const newMovie = {
		id: crypto.randomUUID(),
		...result.data
	}

	movies.push(newMovie)

	res.status(201).json(newMovie)
})

//? ACTUALIZAR UNA PELÍCULA POR SU ID CON PATCH
app.patch('/movies/:id', (req, res) => {
	const result = partialValidateMovie(req.body)

	if (result.error)
		return res.statusMessage(422).json({ error: JSON.parse(result.error.message) })

	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1) {
		return res.status(404).json({ message: 'Movie not found' })
	}

	const updatedMovie = {
		...movies[movieIndex],
		...result.data
	}

	movies[movieIndex] = updatedMovie

	return res.json(updatedMovie)
})

//? ELIMINAR UNA PELÍCULA POR SU ID
app.delete('/movies/:id', (req, res) => {
	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1) {
		return res.status(404).json({ message: 'Movie not found' })
	}

	movies.splice(movieIndex, 1)

	// res.status(204).json() //? 204 No Content
	res.json({ message: 'Movie deleted' }) //? 204 No Content
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
