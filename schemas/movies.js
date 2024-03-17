const z = require('zod')

const movieSchema = z.object({
	title: z
		.string({
			invalid_type_error: 'Movie title must be a string',
			required_error: 'Movie title is required'
		})
		.min(3),
	year: z.number().int().min(1900).max(2024),
	director: z.string(),
	duration: z.number().int().positive(),
	rate: z.number().min(0).max(10).default(0),
	poster: z.string().url({
		message: 'Poster must be a valid URL'
	}),
	genre: z.array(
		z.enum([
			'Action',
			'Adventure',
			'Comedy',
			'Drama',
			'Fantasy',
			'Horror',
			'Mystery',
			'Romance',
			'Sci-Fi',
			'Thriller',
			'Western'
		]),
		{
			required_error: 'Movie genre is required',
			invalid_type_error: 'Movie genre must be an array of strings'
		}
	)
})

function validateMovie(movie) {
	return movieSchema.safeParse(movie)
}

function partialValidateMovie(object) {
	return movieSchema.partial().safeParse(object)
}

module.exports = { validateMovie, partialValidateMovie }
