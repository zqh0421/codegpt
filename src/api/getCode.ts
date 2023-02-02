import { IGetCodeProps } from "../utils/interfaces";
async function getCode(Props: IGetCodeProps) {
  const base64 = require('js-base64').Base64 // npm install js-base64
  const options = Props.token ? {
    headers: {
      'Authorization': 'token ' + Props.token,
    }
  } : {};
  let fetchUrl = `https://api.github.com/repos/${Props.owner}/${Props.repo}/contents/${Props.filePath}${Props.branchName ? `?ref=${Props.branchName}` : ''}`
  try {
    const response = await fetch(fetchUrl,  options)
    const data = await response.json()
    return await base64.decode((data.content))
  } catch (err) {
    console.log(err)
  }
}
// export async function getCode() {
//   const octokit = new Octokit({ });
//   try {
//     const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
//       owner: "zqh0421",
//       repo: "code_gpt",
//       });
  
//     const titleAndAuthor = result.data.map(issue => {title: issue.title, authorID: issue.user.id})
  
//     console.log(titleAndAuthor)
  
//   } catch (error) {
//     console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
//   }
// }

export default getCode