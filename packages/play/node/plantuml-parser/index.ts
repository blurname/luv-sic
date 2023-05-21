const data = `@startuml
|准备阶段|
start
:确定游行时间、地点和路线;
:制定游行方案;
:组织志愿者和参与者;
:准备游行标语、横幅、传单等宣传材料;
|游行阶段|
:集合;
:核对参与者身份;
:发放宣传材料;
if (遇到干扰) then (yes)
  :保持冷静，不要还击;
  :通过宣传材料和口号回应干扰;
else (no)
  :按照游行方案出发;
  :高呼口号，挥舞标语;
endif
:走过指定路线;
if (遇到困难) then (yes)
  :与警方、保安保持沟通，协商解决;
else (no)
  :继续游行;
endif
:到达终点;
|结束阶段|
:组织参与者离开现场;
:清理现场;
:归还游行物资;
stop
@enduml`

type ProcessNode = {
  text: string
  level: number
}

type ConditionNode = {
  text: string
  level: number
  subs: ProcessNode[]
}


const parse = () => {
  const tree = []
  return 
}
