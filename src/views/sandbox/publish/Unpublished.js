import PublishTable from '../../../components/PublishTable'
import usePublish from '../../../components/usePublish'

export default function Unpubished() {

  const {dataSouce,publishM} = usePublish(1)

  return (
    <div>
      <PublishTable dataSouce={dataSouce} publishM={publishM}/>
    </div>
  )
}
