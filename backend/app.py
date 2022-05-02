# IMPORTS ######################################################################
import json
import os
from urllib.error import HTTPError
import openai
from flask import Flask, request, jsonify
from flask_cors import cross_origin
################################################################################

# GLOBAL VARIABLES #############################################################
app = Flask(__name__)  # runs the web server
openai.api_key = os.getenv("OPENAI_API_KEY")  # store API in .env file

model = "curie:ft-personal-2022-05-01-03-46-51"  # Fine-tuned GPT-3 model to query
temperature = None  # GPT-3 parameter set on chatbot home page
################################################################################

# CHATBOT API ##################################################################

@app.route("/chat", methods=["POST"])
@cross_origin()
def get_bot_reply():
    """Queries GPT-3 API with human message and returns AI response.

    This is a helper method that works with a script embedded in chatbot.html
    to return the GPT-3 output. First, we retrieve the current human utterance
    from human_input. Then, we submit a query to the GPT-3 API. Finally, we
    update the previous human and AI utterances and return the GPT-3
    generation as the currernt AI response.

    Returns:
        GPT-3 generation (AI response string).
    """
    json = request.json
    user = json["user"]
    bot = json["bot"]
    messages = json["messages"]
    prompt = generate_prompt(user, bot, messages)

    # Query OpenAI API for GPT-3 generation.
    global model
    try:
        response = openai.Completion.create(
            model=model,
            prompt=prompt,
            temperature=temperature,
            max_tokens=150,
            stop=[user["name"] + ":", bot["name"] + ":", "\n"],
        ).choices[0].text
        is_successful = True
    except Exception as e:
        response = "ERROR: " + str(e)
        is_successful = False

    output = {
        "message": response,
        "success": is_successful,
    }
    response = jsonify(output)
    return response
################################################################################

# HELPER METHODS ###############################################################


def generate_prompt(user, bot, messages):
    """Generates the prompt for the GPT-3 generation.

    Args:
        user: a dictionary containing the name and description of the user character.
        bot: a dictionary containing the name and description of the bot character.
        messages: a collection containing previous conversation messages

    Returns:
        GPT-3 prompt with the AI persona and past three turns.
    """
    user_name, user_description = user["name"], user["description"]
    bot_name, bot_description = bot["name"], bot["description"]
    messages_text = ""
    for message in messages:
        speaker, text = message["speaker"], message["text"]
        messages_text = messages_text + "{}: {}\n".format(speaker, text)
    return """Characters:

* {} - {}
* {} - {}

Conversation:
{}{}:""".format(
        user_name, user_description,
        bot_name, bot_description,
        messages_text,
        bot_name
    )
################################################################################