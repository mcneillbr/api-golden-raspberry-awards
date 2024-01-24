export type MovieInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export type MovieIntervals = {
  min: MovieInterval[];
  max: MovieInterval[];
}
