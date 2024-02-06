//
export const getAwardSeries = [
  {
    $match: {
      winner: 1,
    },
  },
  {
    // Separate the documents by each producer
    $unwind: '$producers',
  },
  {
    // Groups documents by producer
    $group: {
      _id: {
        producer: '$producers',
      },
      // Calculates the minimum and maximum year and the difference between them
      minYear: { $min: '$year' },
      maxYear: { $max: '$year' },
    },
  },
  {
    // result of subtracting the maximum year from the minimum year
    $addFields: {
      interval: {
        $max: { $subtract: ['$maxYear', '$minYear'] },
      },
    },
  },
  {
    // Filters out documents with a year difference greater than zero
    $match: { interval: { $gt: 0 } },
  },
  {
    // Splits the results into two arrays, one for min and one for max
    // Formats documents to the desired format
    $facet: {
      min: [
        { $match: { interval: { $lt: 2 } } },
        { $sort: { interval: 1 } },
        { $limit: 1 },
        {
          $project: {
            _id: 0,
            producer: '$_id.producer',
            interval: '$interval',
            previousWin: '$minYear',
            followingWin: '$maxYear',
          },
        },
      ],
      max: [
        { $match: { interval: { $gt: 1 } } },
        { $sort: { interval: -1 } },
        { $limit: 1 },
        {
          $project: {
            _id: 0,
            producer: '$_id.producer',
            interval: '$interval',
            previousWin: '$minYear',
            followingWin: '$maxYear',
          },
        },
      ],
    },
  },
];
