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
      winnerYears: {
        $addToSet: '$year',
      },
    },
  },
  {
    $project: {
      _id: 0,
      producer: '$_id.producer',
      winnerYears: {
        $sortArray: {
          input: '$winnerYears',
          sortBy: -1,
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      producer: 1,
      winnerYears: 1,
      yearDifferences: {
        $map: {
          input: '$winnerYears',
          as: 'year',
          in: {
            previousWin: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$winnerYears',
                    {
                      $add: [
                        {
                          $indexOfArray: ['$winnerYears', '$$year'],
                        },
                        1,
                      ],
                    },
                  ],
                },
                null,
              ],
            },
            followingWin: '$$year',
            interval: {
              $subtract: [
                {
                  $arrayElemAt: [
                    '$winnerYears',
                    {
                      $indexOfArray: ['$winnerYears', '$$year'],
                    },
                  ],
                },
                {
                  $arrayElemAt: [
                    '$winnerYears',
                    {
                      $add: [
                        {
                          $indexOfArray: ['$winnerYears', '$$year'],
                        },
                        1,
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    $unwind: {
      path: '$yearDifferences',
    },
  },
  {
    $project: {
      _id: 1,
      producer: 1,
      winnerYears: 1,
      interval: '$yearDifferences.interval',
      previousWin: '$yearDifferences.previousWin',
      followingWin: '$yearDifferences.followingWin',
    },
  },
  {
    // Splits the results into two arrays, one for min and one for max
    // Formats documents to the desired format
    $facet: {
      min: [
        {
          $match: {
            interval: {
              $lt: 2,
            },
          },
        },
        {
          $project: {
            _id: 0,
            producer: '$producer',
            interval: '$interval',
            previousWin: '$previousWin',
            followingWin: '$followingWin',
          },
        },
        {
          $sort: {
            previousWin: 1,
          },
        },
      ],
      max: [
        {
          $setWindowFields: {
            sortBy: { interval: -1 },
            output: { maxInterval: { $max: '$interval' } },
          },
        },
        {
          $match: { $expr: { $eq: ['$interval', '$maxInterval'] } },
        },
        {
          $project: {
            _id: 0,
            producer: '$producer',
            interval: '$interval',
            previousWin: '$previousWin',
            followingWin: '$followingWin',
            max_interval: '$maxInterval',
          },
        },
        { $unset: ['maxInterval'] },
        {
          $sort: {
            previousWin: 1,
          },
        },
      ],
    },
  },
];
