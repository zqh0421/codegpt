// https://github.com/openai/openai-node/issues/6
export async function verify(apiKey : string) {
  // 首先访问http://localhost:3000/login
  // 按F12打开控制台
  // 输入正确的api-key之后点'SUBMIT'提交
  // 就可以在控制台看到fetch到的测试信息
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      "model": "text-davinci-003",
      "prompt": "Say this is a test",
      "temperature": 0,
      "max_tokens": 7
    })
  }
  try {
    const response = await fetch('https://api.openai.com/v1/completions', options)
    const data = await response.json()
    console.log(data)
    console.log(data.choices[0].text)
    console.log("Tokens: " + data.usage.completion_tokens)
  } catch (err) {
    console.log(err)
  }
}