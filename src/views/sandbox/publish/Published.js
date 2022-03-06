import PublishTable from '../../../components/PublishTable'
import usePublish from '../../../components/usePublish'

export default function Published() {

  const {dataSouce,sunsetM} = usePublish(2)
  
  return (
    <div>
      <PublishTable dataSouce={dataSouce} sunsetM={sunsetM}/>
    </div>
  )
}