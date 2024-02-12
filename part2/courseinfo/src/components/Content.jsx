import Part from "./Part"

const Content = ({course}) => {
  console.log('course', course)
  const differentParts = course.parts.map(part => {
    console.log('part', part)
    return (
      <ul>
        <Part key={part.id} parts={part} />
      </ul>
    )
  })
  console.log('differentParts', differentParts)
  return <div>{differentParts}</div>
}

export default Content