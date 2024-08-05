import OpenAI from "openai";

const openai = new OpenAI({apiKey:  process.env.OPENAI_API_KEY});

export async function generateRecipe(ingredients) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `Create a recipe containing these ingredients: ${ingredients}. ` }],
    model: "gpt-4o-mini",
  });
  return String(completion.choices[0]?.message?.content)

  

}

generateRecipe();

