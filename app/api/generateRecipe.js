import OpenAI from "openai";

const openai = new OpenAI({apiKey: "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",
dangerouslyAllowBrowser: true});

export async function generateRecipe(ingredients) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `Create a recipe containing these ingredients: ${ingredients}. ` }],
    model: "gpt-4o-mini",
  });
  return String(completion.choices[0]?.message?.content)

  

}

generateRecipe();

