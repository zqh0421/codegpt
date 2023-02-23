import { Base64 } from 'js-base64'
// import type { DataNode } from 'antd/es/tree';
// import fs from 'fs'

// interface GitHubFile {
//   name: string;
//   type: string;
//   path: string;
//   size: number;
//   url: string;
//   content?: string;
// }

// interface IGetFileProps {
//   owner: string;
//   repo: string;
//   filePath: string;
//   token?: string;
//   branchName?: string;
// }

// export interface FileNode extends DataNode {
//   // children
//   // title: name
//   title: string;
//   key: string; // key: path
//   type: string;
//   size: number;
//   url: string;
//   content?: string;
//   children: Array<FileNode>;
// }

// const buildFileNode = (files: Array<GitHubFile>, node: FileNode, Props: IGetFileProps): FileNode => {
//   const map = new Map<string, FileNode>();
//   const PROJECT_PATH = 'F:/model/'
//   for (const file of files) {
//     const newNode: FileNode = {
//       title: file.name,
//       key: file.path,
//       type: file.type,
//       size: file.size,
//       url: file.url,
//       children: new Array<FileNode>()
//     }
//     map.set(file.path, newNode);
//     node.children.push(newNode);
//   }
//   map.forEach((value, key) => {
//     if (value.type==='dir') {
//       // console.log(value.key)
//       getFile({
//         ...Props,
//         filePath: value.key,
//       }).then(res => {
//         buildFileNode(res, value, Props)
//       })
//     } else if (value.type==='file') {
//       const options = Props.token ? {
//         headers: {
//           'Authorization': 'token ' + Props.token,
//         }
//       } : {};
//       getCode(value.url, options).then(res => {
//         value.content = res
//         // 创建一个可以写入的流，写入到文件 newJs.txt 中
//         var writerStream = fs.createWriteStream(PROJECT_PATH + value.key);
//         // 使用 utf8 编码写入数据
//         writerStream.write(res);
//         // 标记文件末尾
//         writerStream.end();
//         // 处理流事件 完成和报错时执行

//         writerStream.on('finish', function () {
//             console.log("写入完毕");
//         });

//         writerStream.on('error', function (err){
//             console.log(err.stack);
//         });
//       })
//     }
//   })
//   return node;
// };

// export async function buildFileTree(Props: IGetFileProps) {
//   let root: FileNode = { title: 'root', type: 'dir', key: '', size: 0, url: '', children: [] };
//   getFile(Props).then(files => {
//     buildFileNode(files as Array<GitHubFile>, root, Props);
//   }).catch((err: any) => {
//     console.error(err)
//   })
//   return root.children
// }

// export async function getFile(Props: IGetFileProps) {
//   const options = Props.token ? {
//     headers: {
//       'Authorization': 'token ' + Props.token,
//     }
//   } : {};
//   const fetchUrl = `https://api.github.com/repos/${Props.owner}/${Props.repo}/contents/${Props.filePath}${Props.branchName ? `?ref=${Props.branchName}` : ''}`
//   try {
//     const response = await fetch(fetchUrl, options)
//     const data = await response.json()
//     return data
//   } catch (err: any) {
//     console.error(err)
//   }
// }

// export async function getCode(url: string, options: any) {
//   try {
//     const response = await fetch(url, options)
//     const data = await response.json()
//     return Base64.decode(data.content)
//   } catch (err) {
//     console.error(err);
//   }
// }