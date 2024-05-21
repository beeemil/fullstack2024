const Total = ({parts}) => (
    <>
    <b>Number of exercises {parts.reduce((sum, part) => sum + part.exercises, 0)}</b>
    </>
  )

export default Total