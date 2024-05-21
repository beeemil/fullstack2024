import Part from './Part'
const Content = ({parts}) => (
    <>
    {parts.map(part => <Part key = {part.id} content = {part.name} exercises = {part.exercises}/>)}
    </>
  )
  export default Content