import PublishTable from '../../../components/PublishTable'
import usePublish from '../../../components/usePublish'

export default function Sunset() {

  const {dataSouce,deleteM} = usePublish(3)
  
  return (
    <div>
      <PublishTable dataSouce={dataSouce} deleteM={deleteM}/>
    </div>
  )
}