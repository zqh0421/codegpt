export {}
export interface IGetCodeProps {
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  branchName?: string
}