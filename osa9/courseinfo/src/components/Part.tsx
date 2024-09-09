import { CoursePart } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (part: CoursePart) => {
  switch (part.kind) {
    case "basic":
      return (
      <div>
        <h3>{part.name} {part.exerciseCount}</h3>
        <i>{part.description}</i>
      </div>
      )
      break;
    case "group":
      return (
      <div>
        <h3>{part.name} {part.exerciseCount}</h3>
        project exercises {part.groupProjectCount}
      </div>
      )
      break;
    case "background":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <i>{part.description}</i><br/>
          Submit to {part.backgroundMaterial}
        </div>
      )
      break;
    case "special":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <i>{part.description}</i><br/>
          requirements:{" "}
          {part.requirements.map((r, index) => (
            <span key={index}>
              {r}
              {index < part.requirements.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )
      break;
    default:
      return assertNever(part);
      break
  }
}

export default Part