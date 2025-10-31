export interface MovieInfo {
  id: number
  title: string
  poster_path: string
  release_date: string
}

export interface MovieDetailInfo extends MovieInfo {
  genres: { id: number; name: string }[]
  homepage: string
  overview: string
  production_countries: { iso_3166_1: string; name: string }[]
  cast: { name: string }[]
}
