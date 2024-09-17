import { NextResponse } from "next/server";
import OpenAI from "openai";

// const openai = new OpenAI({apiKey: "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",
// dangerouslyAllowBrowser: true});

// export async function generateRecipe(ingredients) {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: `Create a recipe containing these ingredients: ${ingredients}. ` }],
//     model: "gpt-4o-mini",
//   });
//   return String(completion.choices[0]?.message?.content)

  

// }

// generateRecipe();


// const systemPrompt = (ingredients) => `
// Create a recipe based on these ingredients: ${ingredients.join(', ')}

// Return in the following JSON format:
// {
//   "recipe":[
//     {
//       "title": "Name of recipe" ,
//       "description": "Description of the recipe",
//       "ingredients_needed" : ["list of ingredients"], 
//       "instructions": ["steps of recipe"]
//     }
//   ]
// }
// `
const systemPrompt = (ingredients) => `
Create a recipe based on these ingredients: ${ingredients.join(', ')}
No Additional Text or Explanations: Do not include any additional explanations, comments, or descriptive text. The response should be limited to the JSON object.
Make sure the instructions go in depth.
Return in the following JSON format:
{
  "recipe": 
    {
      "title": "Name of the recipe",
      "description": "Description of the recipe",
      "ingredients_needed": ["list of ingredients"],
      "instructions": ["steps of the recipe"]
    }
  
}
`;


// export async function POST(req) {
//   const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
//   })
//   const data = await req.text()

//   const completion = await openai.chat.completions.create({
//       messages: [
//           {role: 'system', content: systemPrompt }, 
//           {role: 'user', content: data }, 
//       ], 
//       model: "meta-llama/llama-3.1-8b-instruct:free",
//       response_format: { type: 'json_object' },
//   })
//   console.log(completion.choices[0].message.content)
//   //Parse the JSON response from the OpenAi API
//   const recipe = JSON.parse(completion.choices[0].message.content)

//   //Return the flashcards as a json response
//   return NextResponse.json(recipe.recipe)
// }

export async function POST(req) {
  try {
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const data = await req.json(); // Parse JSON data from request body

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt(data) }, // Use the ingredients from the request
        { role: 'user', content: data.join(', ') }, // Pass the ingredients as user content
      ],
      model: 'meta-llama/llama-3.1-8b-instruct:free',
    });

    const recipe = JSON.parse(completion.choices[0].message.content);
    console.log(completion.choices[0].message.content)
    return NextResponse.json(recipe.recipe); // Return the JSON response
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.error(); // Send error response if something goes wrong
  }
}