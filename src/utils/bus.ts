import mitt from 'mitt'
 
type Events = {
  sendMsg: string
  sendNum: number,
  updateTreeNode: any
}
 
const bus = mitt<Events>()
export default bus


  // // 发布一个事件
  // bus.emit('foo', { a: 'b' })
 
  // // 订阅一个具体的事件
  // bus.on('foo', (e) => console.log('foo', e))
 
  // // 订阅所有事件
  // bus.on('*', (type, e) => console.log(type, e))
 
  // // 取消订阅同名事件
  // bus.off('foo') // unlisten
 
  // // 取消所有事件
  // bus.all.clear()
