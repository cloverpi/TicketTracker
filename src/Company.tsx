
interface Props {
  company: string
}
function Company({company}: Props) {


  return (
    <>
      <h2>
        {company}
      </h2>

    </>
  )
}

export default Company