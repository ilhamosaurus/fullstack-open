const course = {
  name: 'Half Stack application development',
  parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Total = () => {
  return (
    <p>Numbe of exercises {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}</p>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

function App() {
  return (
    <div>
      <Header course={course.name} />
      <Part part={course.parts[0].name} exercises={course.parts[0].exercises} />
      <Part part={course.parts[1].name} exercises={course.parts[1].exercises} />
      <Part part={course.parts[2].name} exercises={course.parts[2].exercises} />
      <Total />
    </div>
  )
}

export default App
