import re
import time
from io import BytesIO
from PIL import Image

from flask import Flask, request, jsonify, send_from_directory, send_file
from google import genai
from google.genai import types
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq

# GROQ_API_KEY = "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"
GROQ_API_KEY = "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"

# GEMINI_API_KEY = "AIzaSyAe0JxIlKee7Jc2A83hV29k2q7OrqW57"
# GEMINI_API_KEY = "AIzaSyD9aQd82Rf-my7-EbztM4ksswGyb1geSqM"
GEMINI_API_KEY = "AIzaSyDSUyKMdfrzSOK2jwqZD0f3dBo59szPmk8"

app = Flask(__name__)
main_prompt_template_story = PromptTemplate(
    input_variables=["user_story_line_input"],
    template="""You are a creative and kind-hearted storyteller AI that writes magical, engaging, and age-appropriate stories for children.
    
## PROMPT VALIDATION — IMPORTANT:
Before writing a story, you MUST evaluate whether the user input is suitable for story generation.

### INVALID INPUT EXAMPLES:
If the input falls into any of these categories, DO NOT generate a story:
- Factual questions (e.g. "age of Elon Musk", "what is 1+11", "capital of France")
- Generic text (e.g. "hello", "hi", "okay", "yes", "what’s up", "how are you")
- Random short text or unclear input (e.g. "lorem ipsum", "xyz", "abc def")
- Off-topic input (e.g. news headlines, tweets, jokes, song lyrics)

### WHAT TO DO:
If the input belongs to above category, DO NOT generate a story.
Instead, respond with actually reason why you won't generate and text that will be accepted rather that given text.

Then STOP.

## STORY SETTINGS:
{user_story_line_input}

(Include details like: Main character name + species + personality trait [e.g. curious/brave/kind], setting [e.g. enchanted forest, floating island], magical twist [e.g. talking trees, glowing river], and a small challenge [e.g. lost item, helping a friend].)

## INSTRUCTIONS
1. Start with a fun or curious sentence that hooks the reader.
2. Make the main character show traits like bravery, kindness, or curiosity.
3. Add a light, child-appropriate conflict to overcome.
4. Sprinkle in magical or whimsical elements — talking animals, enchanted objects, playful surprises.
5. Resolve the story with a creative, satisfying, and positive ending.
6. Use simple, vivid language. Keep paragraphs short and snappy.
7. After any major scene that is visually rich or clearly depicts an action, setting, or magical moment, include an image description enclosed in `<IMAGE>...</IMAGE>`.  
   - Only add this tag when something is truly worth illustrating.
   - Skip the tag for narration-only, abstract parts, or plain dialogue.  
   - The goal is to help illustrators easily spot visual scenes.
8. Image should never be at First or Last part of the story.
9. Make sure the image prompt includes a short summary or clear context about the paragraph or theme of the story. This helps the image generation model understand the vibe and setting—so it creates visuals that actually match the story.
10. Make sure the image prompt includes proper details about the character—whether it's a human, animal, or something else. Mention sex, shape, size, species, and any other key traits.

## STYLE GUIDE
- Warm, friendly tone with a playful rhythm.
- Third-person narration with short, cheerful dialogues.
- No fear, sadness, or complex emotions.
- Visually rich descriptions — light, color, textures, funny details.
- Each story should be long enough for ~5 minute of animation pacing (NOTE: excluding image captions text).
- Use a consistent format alternating story text with `<IMAGE>` captions.
- Use Markdown formatting — add bold titles, add headings, and formate when you think it is needed.

## FORMAT EXAMPLE
# Title of Story
...

<IMAGE>A cheerful fox riding a floating leaf down a sparkling forest stream.</IMAGE>

### Next title
Next part of the story...

<IMAGE>The glowing mushroom village beneath the ancient oak tree, lit with tiny lanterns.</IMAGE>

## GOAL
Write a magical children’s story that clearly tells a visual tale, using `<IMAGE>` tags after major moments to describe what could be illustrated.

Now, begin the story below:""")

# ------------------------------------------------------------------------------------------------------
# Make Sure you have valid path to save the output file of gemini
folder = "/home/rohan/Projects/Research/StoryTellingModel/client/BACKEND/GENERATED_IMAGES/"


# ------------------------------------------------------------------------------------------------------


class StoryGenerator:
    def __init__(self):
        self.model = ChatGroq(
            api_key=GROQ_API_KEY,
            model="llama-3.3-70b-versatile",
            temperature=0.7
        )

        self.main_prompt_template_story = LLMChain(
            llm=self.model,
            prompt=main_prompt_template_story,
            output_key="main_story"
        )

    def generate(self, prompt):
        user_output = self.main_prompt_template_story(prompt).get("main_story")
        token_len = len(user_output)

        coll = re.findall(r"<IMAGE>.*</IMAGE>", user_output)
        for ind, _col in enumerate(coll.copy()):
            coll[ind] = _col.replace("<IMAGE>", "").replace("</IMAGE>", "")
            user_output = user_output.replace(_col, f'<--img--/>')

        return {
            "result": user_output,
            "coll": coll,
            "token_len": token_len
        }


class ImageGenerator:
    def __init__(self):
        self.client = genai.Client(api_key="AIzaSyAe0JxIlKee7Jc2A83hV29k2q7OrqW57-M")

    def generate(self, prompt):
        _t = time.time()

        response = self.client.models.generate_content(
            model="gemini-2.0-flash-exp-image-generation",
            contents=f"""The image is meant for a children's storybook illustration. Create a child-friendly, animated-style image with clean, simple backgrounds and soft colors. The style should be playful and appealing to young kids (ages 3-8).

Details:
- Avoid harsh shadows or dark tones
- Use rounded shapes and smooth textures
- Background should not distract from the main subject
- Everything should feel warm, cute, and imaginative

$$ USER_PROMPT:
{prompt}""", config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE']
            )
        )

        image, file = None, None
        for _plk in response.candidates[0].content.parts:
            image = _plk.inline_data
            if not image:
                continue

            file = f'{re.sub(r"[^A-Za-z0-9]", "_", prompt).lower()[:50]}.png'

            image = BytesIO((image.data))

            image = Image.open(image)
            image.save(file)

            return image, file
        
        return False


storyModel = StoryGenerator()
imageModel = ImageGenerator()


@app.route("/v1/lama/generate/story", methods=["POST"])
def generate():
    prompt = request.json.get("prompt")
    response = storyModel.generate(prompt)

    return jsonify(response), 200


@app.route("/v1/gen/generate/image", methods=["POST"])
def generate_image():
    prompt = request.json.get("prompt")
    response = imageModel.generate(prompt)

    if not response:
        return jsonify({
            "error": "400",
            "message": "Failed to generate image for given prompt."
        }), 400
    
    return send_file(response[0], download_name=response[1], mimetype="image/png"), 200


@app.route("/v1/static/download/image/<file_name>")
def get_image(file_name):
    return send_from_directory(folder, file_name)


@app.after_request
def add_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Origin, Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    return response


if __name__ == '__main__':
    app.run(debug=True, port=5555)
