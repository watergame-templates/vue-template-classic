import AV from 'leancloud-storage'
import axios from 'axios'
/**
 * 文件上传
 * @param fileName
 * @param localFile
 */
export function uploadFile(fileName, localFile) {
  let file = new AV.File(fileName, localFile)
  return file.save()
}
/**
 * 文件转换
 * @param fileName
 * @param localFile
 */
export function fileToAVFile(fileName, localFile) {
  return new AV.File(fileName, localFile)
}
/**
 * 文件查询
 * @param objectId
 */
export function queryFileById(objectId) {
  let query = new AV.Query('_File')
  return query.get(objectId)
}

export async function getLocalPicPath() {
  let pic_all_path = await axios({
    method: 'get',
    url: '/get_all_picture_path',
    responseType: 'json'
  })
  return pic_all_path.data
}

export async function getLocalPicBlob(url) {
  let pic_res = await axios({
    method: 'get',
    url: url,
    responseType: 'blob'
  })

  return pic_res.data
}