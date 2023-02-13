import { IGetCodeProps } from "../utils/interfaces";
import { Base64 } from 'js-base64'
async function getCode(Props: IGetCodeProps) {
  // const base64 = require('js-base64').Base64 // npm install js-base64
  const options = Props.token ? {
    headers: {
      'Authorization': 'token ' + Props.token,
    }
  } : {};
  let fetchUrl = `https://api.github.com/repos/${Props.owner}/${Props.repo}/contents/${Props.filePath}${Props.branchName ? `?ref=${Props.branchName}` : ''}`
  try {
    const response = await fetch(fetchUrl,  options)
    const data = await response.json()
    return await Base64.decode((data.content))
  } catch (err) {
    console.log(err)
  }
}