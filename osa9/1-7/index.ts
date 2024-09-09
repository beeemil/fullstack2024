import express from 'express';
import calculateBmi from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { weight, height } = req.query;
  const w: number = Number(weight);
  const h: number = Number(height);
  try {
    const bmiStatus: string = calculateBmi(h, w);
    res.json(`
      {
        weight: ${w},
        height: ${h},
        bmi: ${bmiStatus}
      }`);
    } catch (error: unknown) {
    let errorMessage = "Something went wrong: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
      res.json(`
        {
          error: ${errorMessage}
        }`);
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  console.log('ex targ', daily_exercises, target);
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result: object = calculateExercises(daily_exercises, target);
    console.log('result', result);
    res.json(result);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong: ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
      res.json(`${errorMessage}`);
    }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});