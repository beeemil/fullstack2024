// interface ContentProps {
//   name: string;
//   exerciseCount: number;
// }

/**
 * Helper function for exhaustive type checking
 */
import { CoursePart } from "../types";
import Part from "./Part";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  console.log('courseparts',props.courseParts);
  return props.courseParts.map(c => <Part key={c.name} {...c}/>); //<p>{props.name} {props.exerciseCount}</p>
}

export default Content