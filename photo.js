const fs = require('fs')
const path = require('path')

const inputFolder = process.argv[2]

const videoExts = ['mp4', 'mov']
const capturedExts = ['png', 'aae']
const imageExts = ['jpg']
const supportedExts = [...videoExts, ...capturedExts, ...imageExts]

const videoPath = path.join(inputFolder, 'video')
const capturedPath = path.join(inputFolder, 'captured')
const duplicatedPath = path.join(inputFolder, 'duplicated')

const undefinedFile = []
const unsupportedExt = []

// 1. 인자로 받은 파일 읽기
fs.readdir(`./${inputFolder}`, (err, files) => {
  console.log('--------------------------------------------------------')
  console.log('폴더정리를 시작합니다.')
  if (err) {
    console.error('파일을 읽는데 실패하였습니다. 파일 이름을 확인해주세요.')
    throw err
  }

  makeFolder()
  
  for (const file of files) {
    defineFile(file)
  }

  console.log('폴더정리를 완료하였습니다.')
  if (undefinedFile.length > 0) console.log('알수없는 파일: ', undefinedFile)
  if (unsupportedExt.length > 0) console.log('지원하지 않는 파일: ', unsupportedExt)
  console.log('--------------------------------------------------------');
})

// 용도별 폴더 생성하는 함수
function makeFolder () {
  
  if (!fs.existsSync(videoPath)) fs.mkdirSync(videoPath)
  if (!fs.existsSync(capturedPath)) fs.mkdirSync(capturedPath)
  if (!fs.existsSync(duplicatedPath)) fs.mkdirSync(duplicatedPath)
}

// 파일 하나의 용도를 파악해서 파일을 옮겨주는 함수
function defineFile (file) {
  if (['video', 'captured', 'duplicated'].includes(file)) return
  const [name, ext] = file.split('.')
  if (!name || !ext) return undefinedFile.push(file)
  if (!supportedExts.includes(ext)) return unsupportedExt(file)

  const originPath = path.join(inputFolder, file)

  if (isVideo(ext)) fs.renameSync(originPath, path.join(videoPath, file))
  if (isCaptured(ext)) fs.renameSync(originPath, path.join(capturedPath, file))

  const originImg = evalDupl(name, ext)
  if (originImg) fs.renameSync(path.join(inputFolder, originImg), path.join(duplicatedPath, originImg))
}

function isVideo (ext) {
  if (videoExts.includes(ext)) return true
  return false
}

function isCaptured(ext) {
  if (capturedExts.includes(ext)) return true
  return false
}

function evalDupl(name, ext) {
  if (name.search(/_E/) !== -1) {
    // duplicated된 폴더일경우 원본사진을 리턴함
    const originName = name.replace('E', '')
    return `${originName}.${ext}`
  }
  return false
}