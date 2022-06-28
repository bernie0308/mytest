import qs from 'qs'
import { useRoute } from 'vue-router'
const route = useRoute()
const BASE_URL = 'https://shopify-manage.yuanqisenlin-test.com/api/admin/'
// const BASE_URL = window.location.hostname + '/api/admin/'
// 校验文件格式
export const fileTypeValidate = (fileName: string, accept: Array<string>) => {
  const fileNameSplit = fileName.split('.')
  const suffix = fileNameSplit[fileNameSplit.length - 1]
  return accept.includes(suffix)
}

// 导出文件
// export function exportFile(data:any, filename:string, ext = "xlsx", type = "application/vnd.ms-excel") {
//   let blob = new Blob([data], { type });
//   if (window.navigator.msSaveBlob) {
//     try {
//       window.navigator.msSaveBlob(data, filename);
//     } catch (e) {
//       console.log(e);
//     }
//   } else {
//     let elink = document.createElement("a");
//     elink.download = filename + "." + ext;
//     elink.style.display = "none";
//     let href = window.URL.createObjectURL(blob);
//     elink.href = href;
//     document.body.appendChild(elink);
//     elink.click();
//     document.body.removeChild(elink);
//     window.URL.revokeObjectURL(href); // 释放掉blob对象
//   }
// }

// 导出文件
export function exportFile(api:string, data:any) {
  var url = BASE_URL + api + qs.stringify( data , { arrayFormat: 'brackets' })
  console.log(url)
  window.open(url)
}
