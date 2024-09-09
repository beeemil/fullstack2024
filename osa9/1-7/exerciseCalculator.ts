interface Rating {
  value: number;
  explanation: string;
}

export interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

interface Input {
  exercises: number[],
  target: number
}

const rate = (target: number, actual: number): Rating => {
  const ratio: number = actual / target;
  if (ratio > 0.9) {
    return { value: 3, explanation: "Very good!" };
  } else if (ratio <= 0.9 && ratio > 0.5) {
    return { value: 2, explanation: "Not great, not terrible" };
  };
  return { value: 1, explanation: "You know you can do better" };
};
export const calculateExercises = (exercises: number[], target: number): object => {
  if (!exercises || !target) {
    throw new Error('Parameters missing');
  }
  if (!Array.isArray(exercises) || exercises.some(e => typeof e !== 'number' || e < 0)) {
    throw new Error('Exercise record must consist of numbers >= 0!');
  }
  if (typeof target !== 'number' || target <= 0) {
    throw new Error('Target must be a positive number!');
  }
  const numberOfDays: number = exercises.length;
  const numberOfTrainingDays: number = exercises.filter(e => e > 0).length;
  const averageTime: number = exercises.reduce((acc, val) => acc + val, 0) / numberOfDays;
  const reachedGoal: boolean = averageTime >= target;
  const rating: Rating = rate(target, averageTime);
  return {
    periodLength: numberOfDays,
    trainingDays: numberOfTrainingDays,
    success: reachedGoal,
    rating: rating.value,
    ratingDescription: rating.explanation,
    target,
    average: averageTime
  };
};

const argParser = (args: string[]): Input => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const parsedArray: number[] = args.slice(3).map(i => Number(i));
    return {
    exercises: parsedArray,
    target: Number(args[2])
  };
};

if (require.main === module) {
  const inputs: Input = argParser(process.argv);
  console.log(calculateExercises(inputs.exercises, inputs.target));

}