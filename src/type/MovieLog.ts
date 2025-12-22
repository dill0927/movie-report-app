export interface MovieState {
  title: string
  posterPath: string
}

export interface FormData {
  watchedDate: string
  watchType?: '映画館' | '配信'
  memo?: string
}

export type MovieLog = MovieState &
  FormData & {
    id: number
  }
