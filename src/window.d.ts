// 这个不能加export 加了就识别不到cityData了
declare interface Window {
  $message: Record<string, any>
}