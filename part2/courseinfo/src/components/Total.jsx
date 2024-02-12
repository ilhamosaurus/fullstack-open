const Total = ({course}) => {
  const totalAmount = course.parts.reduce((sum, order) => sum + order.exercises, 0)
  console.log('totalAmount', totalAmount)
  return (
    <strong>total of {totalAmount} exercises</strong>
  )
}

export default Total