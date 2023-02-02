export async function request(api_key : string, value : any) {

  const getPromptPrefix = (command: string) => {
    switch (command) {
      case "Ask CodeGPT": return ""
      case "Explain": return "Explain what this code does: "
      case "Refactor": return "Refactor this code and then explain what's changed: "
      case "Optimize": return "Optimize the following code if there is anything to improve, add some notes explaining how you optimized: "
      case "Find Problems": return "Find problems with the following code, fix them and explain what was wrong (Do not change anything else, if there are no problems say so): "
      case "Documentation": return "Write documentation for the following code: "
      default: return ""
    }
  }
  console.log("request!")
  const model = value.model || "text-davinci-003";
  const temperature = value.temperature || 0.7;
  const maximum_length = value.maximum_length || 256;
  const promptPrefix = getPromptPrefix(value.command)
  const prompt = promptPrefix + (value.prompt || "Say this is a test.");
  console.log(prompt)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    },
    body: JSON.stringify({
      "model": model,
      "prompt": prompt,
      "temperature": temperature,
      "max_tokens": maximum_length
    })
  }
  try {
    const response = await fetch('https://api.openai.com/v1/completions', options)
    const data = await response.json()
    console.log(data)
    console.log("Tokens: " + data.usage.completion_tokens)
    return data.choices[0].text
  } catch (err) {
    console.log(err)
  }
}